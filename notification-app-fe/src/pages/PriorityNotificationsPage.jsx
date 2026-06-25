return (
  <Box
    sx={{
      minHeight: "100vh",
      bgcolor: "#f5f7fa",
      py: 4,
      px: 2,
    }}
  >
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        bgcolor: "white",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background:
            "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
          color: "white",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <StarIcon sx={{ fontSize: 36 }} />

          <Box>
            <Typography variant="h4" fontWeight={700}>
              Priority Notifications
            </Typography>

            <Typography variant="body2">
              Top important notifications requiring attention
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            py: 8,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" variant="filled">
            Failed to load priority notifications: {error}
          </Alert>
        </Box>
      )}

      {/* Empty */}
      {!loading && !error && notifications.length === 0 && (
        <Box sx={{ p: 4 }}>
          <Alert severity="info">
            No priority notifications available.
          </Alert>
        </Box>
      )}

      {/* Notification List */}
      {!loading && !error && notifications.length > 0 && (
        <Stack
          spacing={2}
          sx={{
            p: 3,
            bgcolor: "#fafafa",
          }}
        >
          {notifications.map((n, idx) => (
            <Box
              key={n.ID}
              sx={{
                position: "relative",
              }}
            >
              {/* Ranking Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  left: -10,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor:
                    idx === 0
                      ? "#f44336"
                      : idx === 1
                      ? "#ff9800"
                      : "#1976d2",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  zIndex: 1,
                  boxShadow: 2,
                }}
              >
                {idx + 1}
              </Box>

              <Box
                sx={{
                  borderLeft: "5px solid #ff9800",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <NotificationCard
                  notification={n}
                  viewed={false}
                  onView={() => {}}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  </Box>
);