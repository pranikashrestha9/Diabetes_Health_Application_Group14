export const MeetLinkGenerator = {
  generate: () => {
    const random = Math.random().toString(36).substring(2, 10);

    return `https://meet.google.com/${random.substring(0, 3)}-${random.substring(3, 7)}-${random.substring(7, 10)}`;
  },
};