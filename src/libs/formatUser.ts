export const formatUser = (user: any) => {
  const { password, ...rest } = user;
  return rest;
};