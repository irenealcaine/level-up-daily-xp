const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    ...(mapsApiKey
      ? [["react-native-maps", { androidGoogleMapsApiKey: mapsApiKey }]]
      : []),
  ],
})
