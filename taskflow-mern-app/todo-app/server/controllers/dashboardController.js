const Task = require('../models/Task');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      dueTodayTasks,
      dueThisWeek,
      priorityBreakdown,
      categoryBreakdown,
      recentActivity,
      completionTrend,
    ] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, completed: true }),
      Task.countDocuments({ user: userId, completed: false }),
      Task.countDocuments({ user: userId, completed: false, dueDate: { $lt: now } }),
      Task.countDocuments({ user: userId, completed: false, dueDate: { $gte: todayStart, $lt: new Date(todayStart.getTime() + 86400000) } }),
      Task.countDocuments({ user: userId, completed: false, dueDate: { $gte: weekStart, $lt: new Date(weekStart.getTime() + 7 * 86400000) } }),
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 }, completed: { $sum: { $cond: ['$completed', 1, 0] } } } },
        { $sort: { _id: 1 } },
      ]),
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', count: { $sum: 1 }, completed: { $sum: { $cond: ['$completed', 1, 0] } } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Task.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title completed priority updatedAt completedAt')
        .lean(),
      // Last 7 days completion trend
      Task.aggregate([
        {
          $match: {
            user: userId,
            completed: true,
            completedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        dueTodayTasks,
        dueThisWeek,
        completionRate,
        priorityBreakdown,
        categoryBreakdown,
        recentActivity,
        completionTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
