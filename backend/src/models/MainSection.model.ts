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
  Scopes,
  HasMany,
} from "sequelize-typescript";
import Course from "./Course.model";
import SubSection from "./SubSection.model";

// All attributes
type MainSectionAttributes = {
  id: string;
  subject: string;
  code: string;
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
@Scopes(() => ({
  default: {
    include: [
      {
        model: SubSection,
      },
    ],
  },
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
  @Column({ type: DataType.TIME, field: "start_time" })
  startTime: Date;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: "end_time" })
  endTime: Date;

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
}

export default MainSection;
