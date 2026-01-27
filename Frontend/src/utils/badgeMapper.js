export const getBadgeStyle = (code) => {
  switch (code) {
    case "FIRST_CHECKIN":
      return { icon: "🌅", color: "blue", label: "First Step" };
    case "STREAK_3":
      return { icon: "🔥", color: "orange", label: "On Fire" };
    case "STREAK_7":
      return { icon: "🧨", color: "red", label: "Unstoppable" };
    case "STREAK_30":
      return { icon: "🏆", color: "purple", label: "Streak Master" };
    case "CREATOR":
      return { icon: "🎨", color: "pink", label: "Creator" };
    case "FINISHER":
      return { icon: "🏁", color: "green", label: "Finisher" };
    case "TOP_PERFORMER":
      return { icon: "👑", color: "yellow", label: "Champion" };
    default:
      return { icon: "🏅", color: "gray", label: "Badge" };
  }
};