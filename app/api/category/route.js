import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/isAuthentication";
import CategoryModel from "@/models/category.model";

export async function GET(request) {
  try {
    const auth = isAuthenticated("admin");
    if (!auth) {
      return response(false, 401, "Unauthorized");
    }

    await connectDB();
    const searchParam = request.nextUrl.searchParams;
    const page = parseInt(searchParam.get("page")) || 1;
    const limit = parseInt(searchParam.get("limit")) || 10;
    const filters = JSON.parse(searchParam.get("filter") || "[]");
    const globalFilter = searchParam.get("globalFilter") || "";
    const sorting = JSON.parse(searchParam.get("sorting") || "[]");
    const deleteType = searchParam.get("deleteType");

    // build match query
    let matchQuery = {};
    if (deleteType === "SD") {
      matchQuery = {
        deletedAt: null,
      };
    } else if (deleteType === "PD") {
      matchQuery = {
        deletedAt: { $ne: null },
      };
    }

    // search query
    if (globalFilter) {
      matchQuery["$or"] = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // column filteration
    filters.forEach((filter) => {
      matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
    });

    // sorting
    const sortQuery = sorting.reduce((acc, sort) => {
      acc[sort.id] = sort.desc ? -1 : 1;
      return acc;
    }, {});

    //  aggregate pipeline
    const aggregatePipeline = [
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // execute query
    const [data, count] = await Promise.all([
      CategoryModel.aggregate(aggregatePipeline),
      CategoryModel.countDocuments(matchQuery),
    ]);

    // return response
    return response(true, 200, "Categories fetched successfully", {
      data,
      meta: {
        totalRowCount: count,
        totalPageCount: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}
