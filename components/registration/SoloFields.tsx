import { useFormContext, type UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/Input';
import { RegistrationInput } from '@/lib/validations/registration';

export function SoloFields() {
  const { register, formState: { errors } } = useFormContext<RegistrationInput>() as unknown as UseFormReturn<Extract<RegistrationInput, { registrationType: 'solo' }>>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Full Name"
          placeholder="AS PER OFFICIAL RECORDS"
          {...register('fullName')}
          error={errors.fullName?.message as string}
        />
        <Input 
          label="Email Address"
          type="email"
          placeholder="PERSONAL OR ACADEMIC"
          {...register('email')}
          error={errors.email?.message as string}
        />
        <Input 
          label="WhatsApp Number"
          placeholder="+91 XXXXXXXXXX"
          {...register('whatsapp')}
          error={errors.whatsapp?.message as string}
        />
        <Input 
          label="IEEE Member ID (Optional)"
          placeholder="IF APPLICABLE"
          {...register('ieeeId')}
          error={errors.ieeeId?.message as string}
        />
      </div>
    </div>
  );
}
