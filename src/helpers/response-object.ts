import { responseObjectType } from 'src/types/utils';

export default ({ message, data }: responseObjectType) => {
  return {
    message,
    data,
  };
};
