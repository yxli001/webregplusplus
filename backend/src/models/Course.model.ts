import type { Optional } from "sequelize";
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
