import { QueryTypes } from "sequelize";
import sequelize from '../db/connection';

class DBHelper {
    public async selectQuery(query: string, onlyFirst?: boolean): Promise<Array<any>> {
        const result = await sequelize.query(query, { type: QueryTypes.SELECT });
        if (result && result.length > 0) return onlyFirst ? result : result
        return []
    }
}
export default new DBHelper();
