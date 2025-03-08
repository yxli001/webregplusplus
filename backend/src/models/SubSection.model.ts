import { SubSectionType } from "@/types";
import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  DataType,
  CreatedAt,
  AllowNull,
  Default,
  UpdatedAt,
  BelongsTo,
} from "sequelize-typescript";
import MainSection from "./MainSection.model";

// All attributes
type SubSectionAttributes = {
  id: string;
  type: SubSectionType;
  section: number;
  instructor: string;
  days: string;
  startTime: string;
  endTime: string;
  location: string;
  mainSectionId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Define the creation attributes of the School model
type SubSectionCreationAttributes = Optional<SubSectionAttributes, "id">;

/**
 * The SubSection model represents a sub section in the database.
 *
 * @class SubSection
 * @extends Model
 *
 * @see {@link MainSection}
 */
@Table({
  tableName: "sub_section",
})
class SubSection extends Model<
  SubSectionAttributes,
  SubSectionCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  type: SubSectionType;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  section: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  instructor: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  days: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: "start_time" })
  startTime: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: "end_time" })
  endTime: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  location: string;

  @ForeignKey(() => MainSection)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "main_section_id" })
  mainSectionId: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  // Relationships
  @BelongsTo(() => MainSection)
  mainSection: MainSection;
}

export default SubSection;
