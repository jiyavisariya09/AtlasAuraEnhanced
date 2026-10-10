'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from '@/data/countries';
import { validatePhone } from '@/lib/phone-validation';

interface CountryPhoneInputProps {
  value: string;
  countryCode?: string;
  onChange: (value: string, fullE164: string, country: Country, isValid: boolean) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  placeholder?: string;
  className?: string;
}

export function CountryPhoneInput({
  value,
  countryCode = 'IN',
  onChange,
  error,
  disabled = false,
  required = false,
  id = 'phone-input',
  placeholder,
  className = '',
}: CountryPhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === countryCode) || DEFAULT_COUNTRY
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.dialCode.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    const result = validatePhone(value, country.code);
    onChange(value, result.e164, country, result.isValid);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Allow digits and spaces/hyphens
    const cleaned = rawVal.replace(/[^\d\s-]/g, '');
    const result = validatePhone(cleaned, selectedCountry.code);
    onChange(cleaned, result.e164, selectedCountry, result.isValid);
  };

  return (
    <div className={`space-y-1 font-sans ${className}`} ref={dropdownRef}>
      <div
        className={`relative flex items-center rounded-xl bg-card/60 border transition-all duration-200 ${
          error
            ? 'border-destructive ring-1 ring-destructive/30'
            : 'border-border focus-within:border-aurora focus-within:ring-2 focus-within:ring-aurora/20'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {/* Country Code Trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-2.5 h-11 border-r border-border hover:bg-muted/40 transition-colors rounded-l-xl text-foreground text-sm font-medium shrink-0 cursor-pointer select-none"
        >
          <span className="text-lg leading-none" role="img" aria-label={selectedCountry.name}>
            {selectedCountry.flag}
          </span>
          <span className="text-xs font-semibold text-foreground/90 font-mono">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* National Number Input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder || selectedCountry.placeholder}
          disabled={disabled}
          required={required}
          className="w-full h-11 px-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none font-sans"
        />

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 max-h-72 bg-popover text-popover-foreground border border-border rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Search Box */}
            <div className="p-2 border-b border-border bg-muted/30">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-aurora"
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="overflow-y-auto max-h-56 divide-y divide-border/30" role="listbox">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No matching countries found
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = c.code === selectedCountry.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleCountrySelect(c)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted/50 transition-colors text-left cursor-pointer ${
                        isSelected ? 'bg-aurora/10 text-aurora font-medium' : 'text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base shrink-0">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                        <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                          ({c.code})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-2 shrink-0">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {c.dialCode}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-aurora shrink-0" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Field Error Message */}
      {error && (
        <p className="text-[11px] text-destructive font-medium pl-1 animate-in fade-in duration-150">
          {error}
        </p>
      )}
    </div>
  );
}
export default CountryPhoneInput;
