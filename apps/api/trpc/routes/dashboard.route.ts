import { publicProcedure, router } from "../../utils/trpc";
import { dashboardService } from "../../services/dashboard.service";

export const dashboardRouter = router({
  stats: publicProcedure.query(async () => {
    const statistic = await dashboardService();
    return {
      message: "Dashboard statistics fetched successfully",
      statistic,
    };
  }),
});
