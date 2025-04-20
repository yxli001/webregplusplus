import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  AllowNull,
  Default,
  UpdatedAt,
  Unique,
} from "sequelize-typescript";

// All attributes
type QuarterAttributes = {
  id: string;
  name: string;
};

// Define the creation attributes of the School model
type QuarterCreationAttributes = Optional<QuarterAttributes, "id">;

/**
 * The Quarter model represents a quarter in the database.
 *
 * @class Quarter
 * @extends Model
 *
 */
@Table({
  tableName: "quarter",
})
class Quarter extends Model<QuarterAttributes, QuarterCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  name: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;
}

export default Quarter;
