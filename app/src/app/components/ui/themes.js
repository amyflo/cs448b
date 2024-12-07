<ThemesTransition
  themes={[
    {
      id: 1,
      name: "Reflections on Moments of Time",
      description: "Letters reflecting on cherished or missed moments.",
    },
    {
      id: 2,
      name: "Idealistic Soulmates",
      description: "Dreamy and romantic expressions about 'the one'.",
    },
    {
      id: 3,
      name: "Enduring Relationship Struggles",
      description: "Explores conflict and resolution within relationships.",
    },
    {
      id: 4,
      name: "Serenity and Beauty",
      description: "Calm and poetic depictions of love's tranquility.",
    },
    {
      id: 5,
      name: "Playful Flirtation",
      description: "Light-hearted, witty, and teasing letters of affection.",
    },
    {
      id: 6,
      name: "Hopeful Goodbyes",
      description: "Bittersweet farewells with a touch of optimism.",
    },
    {
      id: 7,
      name: "Reflection on Life Journey",
      description: "Letters contemplating life, growth, and love’s role in it.",
    },
    {
      id: 8,
      name: "Empathy, Forgiveness, and Apology",
      description: "Themes of reconciliation and understanding.",
    },
    {
      id: 9,
      name: "Vulnerability and Heartbreak",
      description: "Raw emotions of loss and yearning.",
    },
    {
      id: 10,
      name: "Playful Longing",
      description: "Cheerful, yet heartfelt expressions of desire.",
    },
    {
      id: 11,
      name: "Uncertainty in Relationships",
      description: "Doubts and questions surrounding love.",
    },
    {
      id: 12,
      name: "Substance Use and Escapism",
      description: "Themes of distraction and coping in love.",
    },
    {
      id: 13,
      name: "Spirituality and Music",
      description:
        "Love letters intertwined with spiritual or musical elements.",
    },
    {
      id: 14,
      name: "Sexuality, Longing, and Confusion",
      description: "Explorations of identity and physical desire.",
    },
    {
      id: 15,
      name: "Family Dynamics",
      description: "Letters reflecting love within familial relationships.",
    },
  ]}
  renderTheme={(theme) => (
    <div
      className="theme-card"
      key={theme.id}
      onClick={() => handleThemeClick(theme.id)}
      onMouseEnter={() => setHoveredTheme(theme.id)}
      onMouseLeave={() => setHoveredTheme(null)}
      style={{
        padding: "1rem",
        margin: "0.5rem",
        borderRadius: "8px",
        boxShadow:
          hoveredTheme === theme.id
            ? "0px 4px 8px rgba(0, 0, 0, 0.2)"
            : "0px 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: hoveredTheme === theme.id ? "#f0f8ff" : "#fff",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <h3 style={{ margin: "0 0 0.5rem" }}>{theme.name}</h3>
      {hoveredTheme === theme.id && (
        <p style={{ fontSize: "0.9rem", color: "#555" }}>{theme.description}</p>
      )}
    </div>
  )}
/>;
