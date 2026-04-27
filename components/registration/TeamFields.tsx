import { useFieldArray, useFormContext, type UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistrationInput } from '@/lib/validations/registration';

export function TeamFields() {
  const { register, control, formState: { errors } } = useFormContext<RegistrationInput>() as unknown as UseFormReturn<Extract<RegistrationInput, { registrationType: 'team' }>>;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members"
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
        <Input 
          label="Team Name"
          placeholder="CHOOSE A UNIQUE ALIAS"
          {...register('teamName')}
          error={errors.teamName?.message as string}
        />
        <Input 
          label="Team Lead Email"
          type="email"
          placeholder="MAIN CONTACT"
          {...register('teamLeadEmail')}
          error={errors.teamLeadEmail?.message as string}
        />
        <Input 
          label="WhatsApp Number (Lead)"
          placeholder="+91 XXXXXXXXXX"
          {...register('whatsapp')}
          error={errors.whatsapp?.message as string}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40">
            <Users size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Syndicate Members</span>
          </div>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm" 
            onClick={() => append({ name: '', email: '', ieeeId: '' })}
          >
            <Plus size={14} className="mr-2" />
            ADD MEMBER
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {fields.map((field, index) => (
              <motion.div 
                key={field.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black/20 nm-inset p-5 rounded-2xl relative group"
              >
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
                <div className="space-y-4">
                  <Input 
                    placeholder="MEMBER NAME"
                    {...register(`members.${index}.name`)}
                    className="bg-transparent border-white/5 px-2 py-2"
                  />
                  <Input 
                    placeholder="MEMBER EMAIL"
                    {...register(`members.${index}.email`)}
                    className="bg-transparent border-white/5 px-2 py-2"
                  />
                  <Input 
                    placeholder="IEEE ID (OPTIONAL)"
                    {...register(`members.${index}.ieeeId`)}
                    className="bg-transparent border-white/5 px-2 py-2"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {errors.members?.message && (
          <p className="text-[10px] text-red-500/80 font-bold uppercase tracking-wider text-center">
            {errors.members.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
