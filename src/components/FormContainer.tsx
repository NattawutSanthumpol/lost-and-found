/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "itemType"
    | "lostItem"
    | "user";
  id?: number;
};

const FormContainer = async ({ table, id }: FormContainerProps) => {

  return (
    <div className="">
      <FormModal
        table={table}
        id={id}
      />
    </div>
  );
};

export default FormContainer;
