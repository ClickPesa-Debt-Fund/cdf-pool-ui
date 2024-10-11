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

export const retrosharedCommands = (
  walletAddress?: string
): Record<RETROSHADES_COMMANDS, String> => {
  return {
    [RETROSHADES_COMMANDS.TOTAL_USDC_SUPPLIED]: `SELECT
            reserve_address,
            SUM(usdc_amount)
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                usdc_amount
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'supply'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_COLLATERAL_SUPPLIED]: `SELECT
            reserve_address,
            SUM(usdc_amount)
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                usdc_amount
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'supply'
                AND reserve_address = '${COLLATERAL_ASSET_ID}'
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_WITHDRAW]: `SELECT
            reserve_address,
            SUM(usdc_amount)
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                usdc_amount
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'withdraw'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_COLLATERAL_WITHDRAW]: `SELECT
            reserve_address,
            SUM(usdc_amount)
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                usdc_amount
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'withdraw'
                AND reserve_address = '${COLLATERAL_ASSET_ID}'
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_REPAID]: `SELECT
            reserve_address,
            SUM(usdc_amount)
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                usdc_amount
            FROM
                ${BORROW_TABLE}
            WHERE
                action_type = 'repay'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records  
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_BORROWED]: `SELECT
            reserve_address,
            SUM(usdc_amount)
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                usdc_amount
            FROM
                ${BORROW_TABLE}
            WHERE
                action_type = 'borrow'
                AND reserve_address = '${USDC_ASSET_ID}'
                ${walletAddress ? `AND user_address = '${walletAddress}'` : ""}
        ) AS unique_records
        GROUP BY
            reserve_address;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_BORROW_PARTICIPANTS]: `SELECT
            action_type,
            reserve_address,
            COUNT(DISTINCT user_address) AS number_of_participants
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                action_type
            FROM
                ${BORROW_TABLE}
            WHERE
                action_type = 'borrow'
                AND reserve_address = '${USDC_ASSET_ID}'
        ) AS unique_records
        GROUP BY
            reserve_address, action_type;`,
    [RETROSHADES_COMMANDS.TOTAL_USDC_SUPPLY_PARTICIPANTS]: `SELECT
            action_type,
            reserve_address,
            COUNT(DISTINCT user_address) AS number_of_participants
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                usdc_amount,
                action_type
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'supply'
                AND reserve_address = '${USDC_ASSET_ID}'
        ) AS unique_records
        GROUP BY
            reserve_address, action_type;`,
    [RETROSHADES_COMMANDS.TOTAL_COLLATERAL_SUPPLY_PARTICIPANTS]: `SELECT
            action_type,
            reserve_address,
            COUNT(DISTINCT user_address) AS number_of_participants
        FROM (
            SELECT DISTINCT
                reserve_address,
                user_address,
                usdc_amount,
                action_type
            FROM
                ${COLLATERAL_SUPPLY_TABLE}
            WHERE
                action_type = 'supply'
                AND reserve_address = '${COLLATERAL_ASSET_ID}'
        ) AS unique_records
        GROUP BY
            reserve_address, action_type;`,
    [RETROSHADES_COMMANDS.SUPPLY_USDC_TRXS]: `SELECT * from ${COLLATERAL_SUPPLY_TABLE} WHERE reserve_address = '${USDC_ASSET_ID}' AND action_type = 'supply' ${
      walletAddress ? `AND user_address = '${walletAddress}'` : ""
    }`,
    [RETROSHADES_COMMANDS.SUPPLY_COLLATERAL_TRXS]: `SELECT * from ${COLLATERAL_SUPPLY_TABLE} WHERE reserve_address = '${COLLATERAL_ASSET_ID}' AND action_type = 'supply' ${
      walletAddress ? `AND user_address = '${walletAddress}'` : ""
    }`,
    [RETROSHADES_COMMANDS.BORROW_USDC_TRXS]: `SELECT * from ${BORROW_TABLE} WHERE reserve_address = '${USDC_ASSET_ID}' AND action_type = 'borrow' ${
      walletAddress ? `AND user_address = '${walletAddress}'` : ""
    }`,
    [RETROSHADES_COMMANDS.REPAY_USDC_TRXS]: `SELECT * from ${BORROW_TABLE} WHERE reserve_address = '${USDC_ASSET_ID}' AND action_type = 'repay' ${
      walletAddress ? `AND user_address = '${walletAddress}'` : ""
    }`,
    [RETROSHADES_COMMANDS.WITHDRAW_USDC_TRXS]: `SELECT * from ${COLLATERAL_SUPPLY_TABLE} WHERE reserve_address = '${USDC_ASSET_ID}' AND action_type = 'withdraw' ${
      walletAddress ? `AND user_address = '${walletAddress}'` : ""
    }`,
    [RETROSHADES_COMMANDS.WITHDRAW_COLLATERAL_TRXS]: `SELECT * from ${COLLATERAL_SUPPLY_TABLE} WHERE reserve_address = '${COLLATERAL_ASSET_ID}' AND action_type = 'withdraw' ${
      walletAddress ? `AND user_address = '${walletAddress}'` : ""
    }`,
  };
};
