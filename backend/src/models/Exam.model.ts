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
import { ExamType } from "@/types";

// All attributes
type ExamAttributes = {
  id: string;
  type: ExamType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  mainSectionId: string;
};

// Define the creation attributes of the School model
type ExamCreationAttributes = Optional<ExamAttributes, "id">;

/**
 * The Exam model represents an exam in the database.
 *
 * @class Exam
 * @extends Model
 *
 * @see {@link MainSection}
 */
@Table({
  tableName: "exam",
})
class Exam extends Model<ExamAttributes, ExamCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  type: ExamType;

  @AllowNull(false)
  @Column(DataType.STRING)
  date: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "start_time" })
  startTime: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "end_time" })
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

export default Exam;
