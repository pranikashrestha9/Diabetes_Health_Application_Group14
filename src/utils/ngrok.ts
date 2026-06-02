import ngrok from "@ngrok/ngrok";

export const startNgrok = async (port: number) => {
  try {
    const listener = await ngrok.connect({
      addr: port,
      authtoken_from_env: true,
    });

    console.log(`🌍 Ngrok URL: ${listener.url()}`);
  } catch (error) {
    console.error("Ngrok error:", error);
  }
};