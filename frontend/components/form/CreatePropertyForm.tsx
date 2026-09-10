'use client';

import { useGetAuthUser } from '@/api/auth';
import { useCreateProperty } from '@/api/properties';
import FilePondField from '@/components/form/fields/FilePondField';
import InputField from '@/components/form/fields/InputField';
import SelectField from '@/components/form/fields/SelectField';
import SwitchField from '@/components/form/fields/SwitchField';
import FieldSet from '@/components/form/FieldSet';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from '@/lib/constants';
import { PropertyFormData, propertySchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const propertyOptions = Object.entries(PropertyTypeEnum).map(([key, value]) => ({
  label: key,
  value: value,
}));

const amenityOptions = Object.entries(AmenityEnum).map(([key, value]) => ({
  label: key,
  value: value,
}));

const highlightOptions = Object.entries(HighlightEnum).map(([key, value]) => ({
  label: key,
  value: value,
}));

export default function CreatePropertyForm() {
  const { data: property, mutate: createProperty, isPending: createLoading } = useCreateProperty();
  const { data: user } = useGetAuthUser();

  const propertyForm = useForm<
    z.input<typeof propertySchema>,
    unknown,
    z.output<typeof propertySchema>
  >({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      description: '',
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: false,
      isParkingIncluded: false,
      photoUrls: [],
      amenities: undefined,
      highlights: undefined,
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      propertyType: undefined,
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: undefined,
    },
  });

  // console.log(propertyForm.watch());

  const handleSubmit = (data: PropertyFormData) => {
    if (!user) {
      return toast.error('user not found');
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      const typedKey = key as keyof PropertyFormData;

      if (typedKey === 'photoUrls') {
        const files = value as File[];
        files.forEach((file) => {
          formData.append('photos', file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    formData.append('managerCognitoId', user.cognitoInfo.userId);
    createProperty(formData);
  };

  return (
    <FormProvider {...propertyForm}>
      <form onSubmit={propertyForm.handleSubmit(handleSubmit)}>
        <FieldGroup>
          <FieldSet legend="Basic Information" addSeparator>
            <InputField name="name" label="Name" />
            <InputField name="description" type="textarea" label="Description" />
          </FieldSet>

          <FieldSet legend="Fees" addSeparator>
            <InputField name="pricePerMonth" type="number" label="Price Per Month" />
            <div className="flex gap-3">
              <InputField name="securityDeposit" type="number" label="Security Deposit" />
              <InputField name="applicationFee" type="number" label="Application Fee" />
            </div>
          </FieldSet>

          <FieldSet legend="Property Details" addSeparator>
            <div className="flex gap-3">
              <InputField name="beds" type="number" label="Number of Bed" />
              <InputField name="baths" type="number" label="Number of Baths" />
              <InputField name="squareFeet" type="number" label="Square Feet" />
            </div>
            <div className="flex gap-12">
              <SwitchField label="Pets Allowed" name="petsAllowed" />
              <SwitchField label="Parking Included" name="parkingIncluded" />
            </div>
            <SelectField name="propertyType" label="Property Type" options={propertyOptions} />
          </FieldSet>

          <FieldSet legend="Amenities & Highlights" addSeparator>
            <div className="flex gap-3">
              <SelectField multiple name="amenities" label="Amenities" options={amenityOptions} />
              <SelectField
                multiple
                name="highlights"
                label="Highlights"
                options={highlightOptions}
              />
            </div>
          </FieldSet>

          <FieldSet legend="Photos" addSeparator>
            <FilePondField
              name="photoUrls"
              label="Property Photos"
              description="Upload up to 10 images"
              maxFiles={10}
            />
          </FieldSet>

          <FieldSet legend="Property Details">
            <InputField name="address" label="Address" />
            <div className="flex gap-3">
              <InputField name="city" label="City" />
              <InputField name="state" label="State" />
              <InputField name="postalCode" label="Postal Code" />
            </div>
            <InputField name="country" label="Country" />
          </FieldSet>
        </FieldGroup>

        <Button type="submit" disabled={createLoading} className="mt-5 w-full py-5 text-base!">
          Create Property
          {createLoading && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </FormProvider>
  );
}
