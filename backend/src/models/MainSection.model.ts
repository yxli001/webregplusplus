import type { Optional } from "sequelize";
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import type { MainSectionType } from "../types";
import Course from "./Course.model";
import Exam from "./Exam.model";
import SubSection from "./SubSection.model";

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
