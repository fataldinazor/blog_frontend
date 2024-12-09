const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
  presetName: import.meta.env.VITE_CLOUDINARY_PRESET_NAME,
  tinymceKey:import.meta.env.VITE_TINYMCE_KEY,
  avatarPresetName: import.meta.env.VITE_CLOUDINARY_PRESET_NAME_FOR_AVATAR
};

export default config;
