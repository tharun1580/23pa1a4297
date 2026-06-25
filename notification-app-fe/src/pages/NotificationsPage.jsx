return (
  <Box
    sx={{
      minHeight: "100vh",
      bgcolor: "#f4f6f8",
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
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background:
            "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
          >
            <NotificationsIcon sx={{ fontSize: 34 }} />
          </Badge>

          <Box>
            <Typography variant="h4" fontWeight={700}>
              Notifications
            </Typography>

            <Typography variant="body2">
              {unreadCount} unread notifications
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Filter */}
      <Box sx={{ p: 3 }}>
        <NotificationFilter
          value={filter}
          onChange={handleFilterChange}
        />
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
            Failed to load notifications: {error}
          </Alert>
        </Box>
      )}

      {/* Empty State */}
      {!loading && !error && notifications.length === 0 && (
        <Box sx={{ p: 5 }}>
          <Alert severity="info">
            No notifications found.
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
          {notifications.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              viewed={viewedIds.has(n.ID)}
              onView={() => markAsViewed(n.ID)}
            />
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box
          sx={{
            py: 3,
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Box>
      )}
    </Box>
  </Box>
);