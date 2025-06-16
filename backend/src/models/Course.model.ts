import { Optional } from "sequelize";
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import MainSection from "./MainSection.model";
import Quarter from "./Quarter.model";

// All attributes
type CourseAttributes = {
  id: string;
  subject: string;
  code: string;
  quarterId: string;
};

// Define the creation attributes of the School model
type CourseCreationAttributes = Optional<CourseAttributes, "id">;

/**
 * The Course model represents a course in the database.
 *
 * @class Course
 * @extends Model
 *
 */
@Scopes(() => ({
  details: {
    include: [
      {
        model: MainSection,
      },
    ],
  },
}))
@Table({
  tableName: "course",
  indexes: [
    // Index for quarter-based queries
    {
      fields: ["quarter_id"],
      name: "idx_course_quarter_id",
    },
    // Index for search queries (subject + code concatenated)
    {
      fields: ["subject", "code"],
      name: "idx_course_subject_code",
    },
    // Unique constraint on subject + code + quarter
    {
      fields: ["subject", "code", "quarter_id"],
      unique: true,
      name: "unique_course_per_quarter",
    },
  ],
})
class Course extends Model<CourseAttributes, CourseCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  subject: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  code: string;

  @ForeignKey(() => Quarter)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "quarter_id" })
  quarterId: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  // Relationships
  @BelongsTo(() => Quarter)
  quarter: Quarter;

  @HasMany(() => MainSection)
  mainSections: MainSection[];
}

export default Course;
