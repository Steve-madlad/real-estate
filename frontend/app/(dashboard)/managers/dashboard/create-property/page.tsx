'use client';

import { useGetAuthUser } from '@/api/auth';
import { useCreateProperty } from '@/api/properties';
import InputField from '@/components/form/InputField';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { FieldGroup, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { propertySchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

export default function CreateProperty() {
  const { data: property, mutate: createProperty } = useCreateProperty();
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
      amenities: '',
      highlights: '',
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      propertyType: undefined,
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });

  return (
    <div>
      <Header title="Create Property" subtitle="Create a new property listing" />

      <Card className="p-6">
        <FormProvider {...propertyForm}>
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Basic Information</FieldLegend>
                <FieldGroup>
                  <InputField name="name" />
                  <InputField name="description" type="textarea" />
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <FieldSet>
                <FieldLegend>Fees</FieldLegend>
                <FieldGroup>
                  <InputField name="pricePerMonth" type="number" />
                  <div className="flex-gap-3">
                    <InputField name="securityDeposit" type="number" />
                    <InputField name="applicationFee" type="number" />
                  </div>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <FieldSet>
                <FieldLegend>Property Details</FieldLegend>
                <FieldGroup>
                  <InputField name="pricePerMonth" type="number" />
                  <div className="flex-gap-3">
                    <InputField name="securityDeposit" type="number" />
                    <InputField name="applicationFee" type="number" />
                  </div>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
