import { parsePhoneNumberFromString, AsYouType, type CountryCode } from 'libphonenumber-js';
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from '@/data/countries';

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formattedNumber: string;
  e164: string;
  nationalNumber: string;
  country: Country;
}

/**
 * Validates a mobile/phone number given raw digits and country ISO code.
 */
export function validatePhone(
  rawInput: string,
  countryCode: string = DEFAULT_COUNTRY.code
): PhoneValidationResult {
  const country = COUNTRIES.find((c) => c.code.toUpperCase() === countryCode.toUpperCase()) || DEFAULT_COUNTRY;
  const digits = rawInput.replace(/\D/g, '');

  if (!digits) {
    return {
      isValid: false,
      error: 'Mobile phone number is required.',
      formattedNumber: '',
      e164: '',
      nationalNumber: '',
      country,
    };
  }

  // Country-specific precise rules
  if (country.code === 'IN') {
    // Standard Indian mobile number rule: 10 digits starting with 6, 7, 8, or 9
    if (digits.length !== 10) {
      return {
        isValid: false,
        error: `Indian mobile number must be exactly 10 digits (currently ${digits.length}).`,
        formattedNumber: digits,
        e164: `${country.dialCode}${digits}`,
        nationalNumber: digits,
        country,
      };
    }
    if (!/^[6-9]/.test(digits)) {
      return {
        isValid: false,
        error: 'Indian mobile numbers must begin with 6, 7, 8, or 9.',
        formattedNumber: digits,
        e164: `${country.dialCode}${digits}`,
        nationalNumber: digits,
        country,
      };
    }
  }

  // Try libphonenumber-js verification
  try {
    const fullNumber = `${country.dialCode}${digits}`;
    const parsed = parsePhoneNumberFromString(fullNumber, country.code as CountryCode);

    if (parsed && parsed.isValid()) {
      return {
        isValid: true,
        formattedNumber: parsed.formatInternational(),
        e164: parsed.number,
        nationalNumber: parsed.nationalNumber,
        country,
      };
    }
  } catch {
    // fallback to generic length check below
  }

  // Generic international length check (between 7 and 15 digits as per E.164)
  if (digits.length >= 7 && digits.length <= 15) {
    return {
      isValid: true,
      formattedNumber: `${country.dialCode} ${digits}`,
      e164: `${country.dialCode}${digits}`,
      nationalNumber: digits,
      country,
    };
  }

  return {
    isValid: false,
    error: `Invalid phone number for ${country.name}.`,
    formattedNumber: digits,
    e164: `${country.dialCode}${digits}`,
    nationalNumber: digits,
    country,
  };
}

/**
 * Format phone digits as user types using AsYouType
 */
export function formatAsYouType(input: string, countryCode: string = DEFAULT_COUNTRY.code): string {
  try {
    const asYouType = new AsYouType(countryCode as CountryCode);
    return asYouType.input(input);
  } catch {
    return input;
  }
}
