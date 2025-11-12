# Registration Error Handling Improvement

## Tasks
- [ ] Update auth-context.tsx register function to extract and return specific error messages from backend
- [ ] Modify RegisterPage.tsx to receive and display specific error messages instead of generic ones
- [ ] Test the improved error handling with various validation scenarios

## Current Issue
- Frontend shows generic "Registration failed" message
- Backend returns specific validation errors (email format, password strength, duplicate email, etc.)
- AxiosError is caught but error details are not extracted from response.data.message

## Implementation Plan
1. Change register function in auth-context.tsx to return { success: boolean, error?: string } instead of boolean
2. Update RegisterPage.tsx to handle the new return type and display specific error messages
3. Test with various error scenarios (invalid email, weak password, duplicate email, etc.)
