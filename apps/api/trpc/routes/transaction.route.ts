import { router, publicProcedure } from "../../utils/trpc";
import {
  checkoutInputSchema,
  transactionDetail,
  updateTransactionStatusSchema,
} from "../../schemas/transaction.schema";
import {
  checkout,
  transactions,
  transaction,
  updateTransactionStatus,
} from "../../services/transaction.service";

export const checkoutRouter = router({
  create: publicProcedure
    .input(checkoutInputSchema)
    .mutation(async ({ input }) => {
      const transaction = await checkout(input);

      return {
        message: "Checkout success",
        transaction,
      };
    }),

  transactions: publicProcedure.query(async () => {
    const transactions2 = await transactions();
    return {
      message: "Transactions fetched successfully",
      transactions2,
    };
  }),

  updateStatus: publicProcedure
    .input(updateTransactionStatusSchema)
    .mutation(async ({ input }) => {
      const updated = await updateTransactionStatus(
        input.transactionId,
        input.status,
      );
      return {
        message: "Transaction status updated successfully",
        updated,
      };
    }),

  transaction: publicProcedure
    .input(transactionDetail)
    .query(async ({ input }) => {
      const transaction2 = await transaction(input.id);
      return {
        message: "Transaction details fetched successfully",
        transaction2,
      };
    }),
});
