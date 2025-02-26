import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  HasMany,
  Scopes,
  AllowNull,
  Default,
  UpdatedAt,
} from "sequelize-typescript";
import MainSection from "./MainSection.model";

// All attributes
type CourseAttributes = {
  id: string;
  subject: string;
  code: string;
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
  default: {
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

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  @HasMany(() => MainSection)
  mainSections: MainSection[];
}

export default Course;
