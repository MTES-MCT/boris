import type { DetailedDate } from './definitions';

// TODO: write specs
export const getDetailedDate = (date: string): DetailedDate => {
  const currentDate = new Date(date);
  const day = currentDate.toLocaleString('fr', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  let hours = currentDate.toLocaleString('fr-FR', {
    hour: 'numeric',
  });

  hours = hours.replace(' ', '');

  const minutes = currentDate.toLocaleString('fr-FR', {
    minute: 'numeric',
  });

  return {
    day,
    time: `${hours}${minutes}`,
  };
};
