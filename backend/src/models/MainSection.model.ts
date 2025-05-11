import { MainSectionType } from "@/types";
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
  HasMany,
  DefaultScope,
} from "sequelize-typescript";
import Course from "./Course.model";
import SubSection from "./SubSection.model";
import Exam from "./Exam.model";

// All attributes
type MainSectionAttributes = {
  id: string;
  type: MainSectionType;
  letter: string;
  instructor: string;
  days: string;
  startTime: string;
  endTime: string;
  location: string;
  courseId: string;
};

// Define the creation attributes of the School model
type MainSectionCreationAttributes = Optional<MainSectionAttributes, "id">;

/**
 * The MainSection model represents a main section in the database.
 *
 * @class MainSection
 * @extends Model
 *
 * @see {@link Course}
 */
@Table({
  tableName: "main_section",
})
@DefaultScope(() => ({
  include: [
    {
      model: SubSection,
    },
    {
      model: Exam,
    },
  ],
}))
class MainSection extends Model<
  MainSectionAttributes,
  MainSectionCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  type: MainSectionType;

  @AllowNull(false)
  @Column(DataType.STRING)
  letter: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  instructor: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  days: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "start_time" })
  startTime: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "end_time" })
  endTime: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  location: string;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "course_id" })
  courseId: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  // Relationships
  @BelongsTo(() => Course)
  course: Course;

  @HasMany(() => SubSection)
  subSections: SubSection[];

  @HasMany(() => Exam)
  exams: Exam[];
}

export default MainSection;
