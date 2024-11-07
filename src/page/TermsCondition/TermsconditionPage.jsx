

import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import CustomButton from "../../utils/CustomButton";

const TermsconditionPage = () => {
  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex gap-4 items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Terms of Conditions</h1>
        </div>
        <Link to={'/settings/edit-terms-conditions/11'}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>
      {/* Your privacy policy content goes here */}
      <div>
        <h1>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam minus
          distinctio veritatis quisquam. Perspiciatis aliquam numquam eligendi
          praesentium aut reiciendis sequi officiis nihil nemo, hic sed nam
          consectetur ipsam, facere, molestiae harum. Quidem sunt voluptatum
          deserunt dignissimos necessitatibus quasi modi doloribus culpa odio
          libero magnam numquam rerum velit harum nobis perferendis assumenda at
          aliquid earum, reiciendis odit reprehenderit. Soluta, odit quae?
          Nesciunt culpa sunt blanditiis aliquid animi, quidem nostrum sequi
          temporibus. Eaque illum rerum rem nisi inventore repellat accusantium
          quaerat, nulla, impedit, provident laboriosam animi? Magni esse porro
          blanditiis. Alias cupiditate amet eos quaerat culpa delectus, eligendi
          est aliquam impedit.
        </h1>
      </div>
    </section>
  );
};

export default TermsconditionPage;
