import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

function grantAccess(tier_required: number) {
	return async (req, _res, next) => {
		try {
			if (
				req.user.userId != req.params.userId ||
				req.user.tier < tier_required
			) {
				throw new ApiError(
					httpStatus.FORBIDDEN,
					"You don't have permission to perform this action",
				);
			}
			next();
		} catch (error) {
			next(error);
		}
	};
}

export { grantAccess };
