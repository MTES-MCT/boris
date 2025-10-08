import type { Page } from '@sveltejs/kit';
import { PUBLIC_NODE_ENV } from '$env/static/public';
import type { GeocodedResponse } from './definitions';
import type { z } from 'zod';
import type { FormFieldError } from './definitions';
import html2pdf from 'html2pdf.js';

export const blockSearchEngineIndexing = (page: Page): boolean => {
  const hiddenPaths = ['/questionnaire', '/simulateur-acquisition'];

  return (
    (PUBLIC_NODE_ENV !== 'production' && PUBLIC_NODE_ENV !== 'ci') ||
    hiddenPaths.includes(page.route.id as string)
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (callback: (...args: any[]) => void, wait = 300) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};

export const clickOutside = (node: Element) => {
  const handleClick = (event: Event) => {
    if (!node.contains(<Node>event.target)) {
      node.dispatchEvent(new CustomEvent('clickoutside'));
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
};

export const addSmoothScroll = () => {
  document
    .getElementsByTagName('html')[0]
    ?.classList.add('scroll-behavior-smooth');
};

export const removeSmoothScroll = () => {
  document
    .getElementsByTagName('html')[0]
    ?.classList.remove('scroll-behavior-smooth');
};

export const getGeocodedResponseLabel = (
  geocodedResponse: GeocodedResponse['properties'],
) => {
  return `${geocodedResponse?.name}, ${geocodedResponse?.context}`;
};
export const formatFormErrors = (
  issues: z.core.$ZodIssue[],
): FormFieldError => {
  let errors = {};

  issues.forEach((issue) => {
    errors = {
      ...errors,
      [issue.path[0]]: issue.message,
    };
  });

  return errors;
};

export const formatLoanPhaseNumber = (number: number) => {
  switch (number) {
    case 1:
      return 'Première phase de remboursement';
    case 2:
      return 'Deuxième phase de remboursement';
    case 3:
      return 'Troisième phase de remboursement';
  }

  return `Phase de remboursement n°${number}`;
};

export const formatLoanPhaseDuration = (
  duration: number,
  deferment: number,
) => {
  if (deferment === 0) {
    return `Durant les ${duration} premières années`;
  } else {
    return `De la ${deferment + 1}ème à la ${deferment + duration}ème année`;
  }
};

export const createPDF = async (element: HTMLElement, filename: string) => {
  const pdfOnlyElements = document.querySelectorAll('.pdf-only');
  pdfOnlyElements.forEach((el) => el.setAttribute('style', 'display: block;'));

  const notPrintableElements = document.querySelectorAll('.not-printable');
  notPrintableElements.forEach((el) =>
    el.setAttribute('style', 'display: none;'),
  );

  const opt = {
    margin: 15,
    html2canvas: {
      useCORS: true,
      scale: 2,
      allowTaint: false,
    },
  };

  const worker = html2pdf()
    .from(element as HTMLElement)
    .set(opt)
    .toPdf();

  const pdf = await worker.get('pdf');

  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(
      `Page ${i} / ${totalPages}`,
      pdf.internal.pageSize.getWidth() - 40,
      pdf.internal.pageSize.getHeight() - 10,
    );
  }

  pdf.save(filename);

  pdfOnlyElements.forEach((el) => el.setAttribute('style', 'display: none;'));
  notPrintableElements.forEach((el) =>
    el.setAttribute('style', 'display: inherit;'),
  );
};
