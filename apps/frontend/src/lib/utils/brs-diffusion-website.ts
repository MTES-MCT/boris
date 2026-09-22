type BrsCardContentParams = {
  programName?: string | null;
  distributorName?: string | null;
  ofsName?: string | null;
  address?: string | null;
  city: string;
  deliveryMonth?: string | null;
};

const normalize = (value?: string | null) => value?.trim() || null;

export const getBrsCardContent = ({
  programName,
  distributorName,
  ofsName,
  address,
  city,
  deliveryMonth,
}: BrsCardContentParams) => {
  const normalizedProgramName = normalize(programName);
  const normalizedDistributorName = normalize(distributorName);
  const normalizedOfsName = normalize(ofsName);
  const normalizedAddress = normalize(address);
  const title =
    normalizedProgramName ||
    normalizedDistributorName ||
    normalizedOfsName ||
    `Programme BRS à ${city}`;

  const displayedAddress =
    normalizedAddress &&
    normalizedAddress !== city &&
    !/^\d{2,3},\s/.test(normalizedAddress)
      ? normalizedAddress
      : null;

  let formattedDeliveryMonth = normalize(deliveryMonth);
  const deliveryMatch = /^(\d{4})-(\d{2})$/.exec(formattedDeliveryMonth || '');

  if (deliveryMatch) {
    formattedDeliveryMonth = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(
      new Date(
        Date.UTC(Number(deliveryMatch[1]), Number(deliveryMatch[2]) - 1, 1),
      ),
    );
  }

  return {
    title,
    distributorName:
      normalizedDistributorName !== title ? normalizedDistributorName : null,
    ofsName: normalizedOfsName !== title ? normalizedOfsName : null,
    address: displayedAddress,
    deliveryMonth: formattedDeliveryMonth,
  };
};
