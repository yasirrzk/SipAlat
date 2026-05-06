import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (dateString: string, formatStr: string = 'dd MMM yyyy') => {
  try {
    return format(parseISO(dateString), formatStr, { locale: id });
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString: string) => {
  return formatDate(dateString, 'dd MMM yyyy, HH:mm');
};
