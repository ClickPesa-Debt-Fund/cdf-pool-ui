import {
  BORROW_TABLE,
  COLLATERAL_SUPPLY_TABLE,
  COLLATERAL_ASSET_ID,
  USDC_ASSET_ID,
} from "@/constants";

export enum RETROSHADES_COMMANDS {
  TOTAL_USDC_SUPPLIED = "TOTAL_USDC_SUPPLIED",
  TOTAL_COLLATERAL_SUPPLIED = "TOTAL_COLLATERAL_SUPPLIED",
  TOTAL_USDC_BORROWED = "TOTAL_USDC_BORROWED",
  TOTAL_USDC_REPAID = "TOTAL_USDC_REPAID",
  TOTAL_USDC_WITHDRAW = "TOTAL_USDC_WITHDRAW",
  TOTAL_COLLATERAL_WITHDRAW = "TOTAL_COLLATERAL_WITHDRAW",
  TOTAL_USDC_SUPPLY_PARTICIPANTS = "TOTAL_USDC_SUPPLY_PARTICIPANTS",
  TOTAL_USDC_BORROW_PARTICIPANTS = "TOTAL_USDC_BORROW_PARTICIPANTS",
  TOTAL_COLLATERAL_SUPPLY_PARTICIPANTS = "TOTAL_COLLATERAL_SUPPLY_PARTICIPANTS",
  SUPPLY_USDC_TRXS = "SUPPLY_USDC_TRXS",
  SUPPLY_COLLATERAL_TRXS = "SUPPLY_COLLATERAL_TRXS",
  BORROW_USDC_TRXS = "BORROW_USDC_TRXS",
  REPAY_USDC_TRXS = "REPAY_USDC_TRXS",
  WITHDRAW_USDC_TRXS = "WITHDRAW_USDC_TRXS",
  WITHDRAW_COLLATERAL_TRXS = "WITHDRAW_COLLATERAL_TRXS",
}

const searchableFields = ["reserve_address", "ledger::text", "transaction"];

export const retrosharedCommands = ({
  walletAddress,
  skip = 0,
  limit = 10,
  search,
  startDate,
  endDate,
  orderBy = "DESC",
  sortBy = "timestamp",
}: RetroshadeParams): Record<RETROSHADES_COMMANDS, String> => {
  return {
    [RETROSHADES_COMMANDS.TOTAL_USDC_SUPPLIED]: `SELECT
            reserve_address,
            SUM(COALESCE(amount,0))
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                amount
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'supply'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${
                  search
                    ? `AND (${searchableFields
                        .map((field) => `${field} ILIKE '%${search}%'`)
                        .join(" OR ")})`
                    : ""
                }
                ${
                    startDate
                    ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                    : ""
                }
                ${
                    endDate
                    ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                    : ""
                }
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_COLLATERAL_SUPPLIED]: `SELECT
            reserve_address,
            SUM(amount)
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                amount
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'supply'
                AND reserve_address = '${COLLATERAL_ASSET_ID}'
                ${
                    search
                      ? `AND (${searchableFields
                          .map((field) => `${field} ILIKE '%${search}%'`)
                          .join(" OR ")})`
                      : ""
                  }
                  ${
                      startDate
                      ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                  ${
                      endDate
                      ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_WITHDRAW]: `SELECT
            reserve_address,
            SUM(amount)
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                amount
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'withdraw'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${
                    search
                      ? `AND (${searchableFields
                          .map((field) => `${field} ILIKE '%${search}%'`)
                          .join(" OR ")})`
                      : ""
                  }
                  ${
                      startDate
                      ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                  ${
                      endDate
                      ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_COLLATERAL_WITHDRAW]: `SELECT
            reserve_address,
            SUM(amount)
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                amount
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'withdraw'
                AND reserve_address = '${COLLATERAL_ASSET_ID}'
                ${
                    search
                      ? `AND (${searchableFields
                          .map((field) => `${field} ILIKE '%${search}%'`)
                          .join(" OR ")})`
                      : ""
                  }
                  ${
                      startDate
                      ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                  ${
                      endDate
                      ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_REPAID]: `SELECT
            reserve_address,
            SUM(amount)
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                amount
            FROM
                ${BORROW_TABLE}
            WHERE
                action_type = 'repay'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${
                    search
                      ? `AND (${searchableFields
                          .map((field) => `${field} ILIKE '%${search}%'`)
                          .join(" OR ")})`
                      : ""
                  }
                  ${
                      startDate
                      ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                  ${
                      endDate
                      ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records  
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_BORROWED]: `SELECT
            reserve_address,
            SUM(amount)
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                amount
            FROM
                ${BORROW_TABLE}
            WHERE
                action_type = 'borrow'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${
                    search
                      ? `AND (${searchableFields
                          .map((field) => `${field} ILIKE '%${search}%'`)
                          .join(" OR ")})`
                      : ""
                  }
                  ${
                      startDate
                      ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                  ${
                      endDate
                      ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_BORROW_PARTICIPANTS]: `SELECT
            action_type,
            reserve_address,
            COUNT(DISTINCT user_address) AS number_of_participants
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                action_type
            FROM
                ${BORROW_TABLE}
            WHERE
                action_type = 'borrow'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${
                    search
                      ? `AND (${searchableFields
                          .map((field) => `${field} ILIKE '%${search}%'`)
                          .join(" OR ")})`
                      : ""
                  }
                  ${
                      startDate
                      ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                  ${
                      endDate
                      ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
        ) AS unique_records
        GROUP BY
            reserve_address, action_type;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_SUPPLY_PARTICIPANTS]: `SELECT
            action_type,
            reserve_address,
            COUNT(DISTINCT user_address) AS number_of_participants
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                amount,
                action_type
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'supply'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${
                  search
                    ? `AND (${searchableFields
                        .map((field) => `${field} ILIKE '%${search}%'`)
                        .join(" OR ")})`
                    : ""
                }
                ${
                    startDate
                    ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                    : ""
                }
                ${
                    endDate
                    ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                    : ""
                }
        ) AS unique_records
        GROUP BY
            reserve_address, action_type;`,
    [RETROSHADES_COMMANDS.TOTAL_COLLATERAL_SUPPLY_PARTICIPANTS]: `SELECT
            action_type,
            reserve_address,
            COUNT(DISTINCT user_address) AS number_of_participants
        FROM (
            SELECT DISTINCT ON (transaction)
                reserve_address,
                user_address,
                amount,
                action_type
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'supply'
                AND reserve_address = '${COLLATERAL_ASSET_ID}'
                ${
                  search
                    ? `AND (${searchableFields
                        .map((field) => `${field} ILIKE '%${search}%'`)
                        .join(" OR ")})`
                    : ""
                }
                  ${
                    startDate
                      ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
                  ${
                    endDate
                      ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                      : ""
                  }
        ) AS unique_records
        GROUP BY
            reserve_address, action_type;`,
    [RETROSHADES_COMMANDS.SUPPLY_USDC_TRXS]: `WITH TotalCount AS (
            SELECT COUNT(DISTINCT transaction) AS totalCount
            FROM ${COLLATERAL_SUPPLY_TABLE}
            WHERE reserve_address = '${USDC_ASSET_ID}' 
                AND action_type = 'supply' 
                ${
                  search
                    ? `AND (${searchableFields
                        .map((field) => `${field} ILIKE '%${search}%'`)
                        .join(" OR ")})`
                    : ""
                }
                ${
                  startDate
                    ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                    : ""
                }
                ${
                  endDate
                    ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                    : ""
                }
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ),
        Data AS (
            SELECT *
            FROM (
                SELECT DISTINCT ON (transaction) *
                FROM ${COLLATERAL_SUPPLY_TABLE}
                WHERE reserve_address = '${USDC_ASSET_ID}' 
                    AND action_type = 'supply' 
                    ${
                      search
                        ? `AND (${searchableFields
                            .map((field) => `${field} ILIKE '%${search}%'`)
                            .join(" OR ")})`
                        : ""
                    }
                    ${
                      startDate
                        ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      endDate
                        ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      walletAddress
                        ? `AND user_address = '${walletAddress}'`
                        : ""
                    }
                ORDER BY transaction
            ) AS distinct_data
            ORDER BY ${sortBy} ${orderBy}
            LIMIT ${limit} OFFSET ${skip}
        )
        SELECT 
            (SELECT totalCount FROM TotalCount) AS totalCount,
            jsonb_agg(row_to_json(Data)) AS data
        FROM Data;`,
    [RETROSHADES_COMMANDS.SUPPLY_COLLATERAL_TRXS]: `WITH TotalCount AS (
        SELECT COUNT(DISTINCT transaction) AS totalCount
        FROM ${COLLATERAL_SUPPLY_TABLE}
        WHERE reserve_address = '${COLLATERAL_ASSET_ID}' 
            AND action_type = 'supply' 
            ${
              search
                ? `AND (${searchableFields
                    .map((field) => `${field} ILIKE '%${search}%'`)
                    .join(" OR ")})`
                : ""
            }
            ${
              startDate
                ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${
              endDate
                ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ),
        Data AS (
            SELECT *
            FROM (
                SELECT DISTINCT ON (transaction) *
                FROM ${COLLATERAL_SUPPLY_TABLE}
                WHERE reserve_address = '${COLLATERAL_ASSET_ID}' 
                    AND action_type = 'supply' 
                    ${
                      search
                        ? `AND (${searchableFields
                            .map((field) => `${field} ILIKE '%${search}%'`)
                            .join(" OR ")})`
                        : ""
                    }
                    ${
                      startDate
                        ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      endDate
                        ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      walletAddress
                        ? `AND user_address = '${walletAddress}'`
                        : ""
                    }
                ORDER BY transaction
            ) AS distinct_data
            ORDER BY ${sortBy} ${orderBy}
            LIMIT ${limit} OFFSET ${skip}
        )
        SELECT 
            (SELECT totalCount FROM TotalCount) AS totalCount,
            jsonb_agg(row_to_json(Data)) AS data
        FROM Data;`,
    [RETROSHADES_COMMANDS.BORROW_USDC_TRXS]: `WITH TotalCount AS (
        SELECT COUNT(DISTINCT transaction) AS totalCount
        FROM ${BORROW_TABLE}
        WHERE reserve_address = '${USDC_ASSET_ID}' 
            AND action_type = 'borrow' 
            ${
              search
                ? `AND (${searchableFields
                    .map((field) => `${field} ILIKE '%${search}%'`)
                    .join(" OR ")})`
                : ""
            }
            ${
              startDate
                ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${
              endDate
                ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ),
        Data AS (
            SELECT *
            FROM (
                SELECT DISTINCT ON (transaction) *
                FROM ${BORROW_TABLE}
                WHERE reserve_address = '${USDC_ASSET_ID}' 
                    AND action_type = 'borrow' 
                    ${
                      search
                        ? `AND (${searchableFields
                            .map((field) => `${field} ILIKE '%${search}%'`)
                            .join(" OR ")})`
                        : ""
                    }
                    ${
                      startDate
                        ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      endDate
                        ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      walletAddress
                        ? `AND user_address = '${walletAddress}'`
                        : ""
                    }
                ORDER BY transaction
            ) AS distinct_data
            ORDER BY ${sortBy} ${orderBy}
            LIMIT ${limit} OFFSET ${skip}
        )
        SELECT 
            (SELECT totalCount FROM TotalCount) AS totalCount,
            jsonb_agg(row_to_json(Data)) AS data
        FROM Data;`,
    [RETROSHADES_COMMANDS.REPAY_USDC_TRXS]: `WITH TotalCount AS (
        SELECT COUNT(DISTINCT transaction) AS totalCount
        FROM ${BORROW_TABLE}
        WHERE reserve_address = '${USDC_ASSET_ID}' 
            AND action_type = 'repay' 
            ${
              search
                ? `AND (${searchableFields
                    .map((field) => `${field} ILIKE '%${search}%'`)
                    .join(" OR ")})`
                : ""
            }
            ${
              startDate
                ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${
              endDate
                ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ),
        Data AS (
            SELECT *
            FROM (
                SELECT DISTINCT ON (transaction) *
                FROM ${BORROW_TABLE}
                WHERE reserve_address = '${USDC_ASSET_ID}' 
                    AND action_type = 'repay' 
                    ${
                      search
                        ? `AND (${searchableFields
                            .map((field) => `${field} ILIKE '%${search}%'`)
                            .join(" OR ")})`
                        : ""
                    }
                    ${
                      startDate
                        ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      endDate
                        ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      walletAddress
                        ? `AND user_address = '${walletAddress}'`
                        : ""
                    }
                ORDER BY transaction
            ) AS distinct_data
            ORDER BY ${sortBy} ${orderBy}
            LIMIT ${limit} OFFSET ${skip}
        )
        SELECT 
            (SELECT totalCount FROM TotalCount) AS totalCount,
            jsonb_agg(row_to_json(Data)) AS data
        FROM Data;`,
    [RETROSHADES_COMMANDS.WITHDRAW_USDC_TRXS]: `WITH TotalCount AS (
        SELECT COUNT(DISTINCT transaction) AS totalCount
        FROM ${COLLATERAL_SUPPLY_TABLE}
        WHERE reserve_address = '${USDC_ASSET_ID}' 
            AND action_type = 'withdraw' 
            ${
              search
                ? `AND (${searchableFields
                    .map((field) => `${field} ILIKE '%${search}%'`)
                    .join(" OR ")})`
                : ""
            }
            ${
              startDate
                ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${
              endDate
                ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ),
        Data AS (
            SELECT *
            FROM (
                SELECT DISTINCT ON (transaction) *
                FROM ${COLLATERAL_SUPPLY_TABLE}
                WHERE reserve_address = '${USDC_ASSET_ID}' 
                    AND action_type = 'withdraw' 
                    ${
                      search
                        ? `AND (${searchableFields
                            .map((field) => `${field} ILIKE '%${search}%'`)
                            .join(" OR ")})`
                        : ""
                    }
                    ${
                      startDate
                        ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      endDate
                        ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      walletAddress
                        ? `AND user_address = '${walletAddress}'`
                        : ""
                    }
                ORDER BY transaction
            ) AS distinct_data
            ORDER BY ${sortBy} ${orderBy}
            LIMIT ${limit} OFFSET ${skip}
        )
        SELECT 
            (SELECT totalCount FROM TotalCount) AS totalCount,
            jsonb_agg(row_to_json(Data)) AS data
        FROM Data;`,
    [RETROSHADES_COMMANDS.WITHDRAW_COLLATERAL_TRXS]: `WITH TotalCount AS (
        SELECT COUNT(DISTINCT transaction) AS totalCount
        FROM ${COLLATERAL_SUPPLY_TABLE}
        WHERE reserve_address = '${COLLATERAL_ASSET_ID}' 
            AND action_type = 'withdraw' 
            ${
              search
                ? `AND (${searchableFields
                    .map((field) => `${field} ILIKE '%${search}%'`)
                    .join(" OR ")})`
                : ""
            }
            ${
              startDate
                ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${
              endDate
                ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                : ""
            }
            ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ),
        Data AS (
            SELECT *
            FROM (
                SELECT DISTINCT ON (transaction) *
                FROM ${COLLATERAL_SUPPLY_TABLE}
                WHERE reserve_address = '${COLLATERAL_ASSET_ID}' 
                    AND action_type = 'withdraw' 
                    ${
                      search
                        ? `AND (${searchableFields
                            .map((field) => `${field} ILIKE '%${search}%'`)
                            .join(" OR ")})`
                        : ""
                    }
                    ${
                      startDate
                        ? `AND timestamp >= EXTRACT(EPOCH FROM to_timestamp('${startDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      endDate
                        ? `AND timestamp <= EXTRACT(EPOCH FROM to_timestamp('${endDate}', 'DD-MM-YYYY'))`
                        : ""
                    }
                    ${
                      walletAddress
                        ? `AND user_address = '${walletAddress}'`
                        : ""
                    }
                ORDER BY transaction
            ) AS distinct_data
            ORDER BY ${sortBy} ${orderBy}
            LIMIT ${limit} OFFSET ${skip}
        )
        SELECT 
            (SELECT totalCount FROM TotalCount) AS totalCount,
            jsonb_agg(row_to_json(Data)) AS data
        FROM Data;`,
  };
};
