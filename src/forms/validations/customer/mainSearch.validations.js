import * as Yup from "yup";

export const mainSearch = Yup.object().shape({
    location: Yup.string().required("Please enter Location"),
    care_types: Yup.string().test({
        name: "min_one_select",
        test: function (value) {
            if (!!value) return true;
            else {
                const error_message = "Select at least one value";
                return this.createError({
                    message: error_message,
                    path: "care_types",
                });
            }
        },
    }),
    type: Yup.string().required("To view prices and availability, please select from suggested location."),
    category: Yup.string().required("Category is required"),
    bedsNo: Yup.string()
        .required("Please enter number of beds")
        .matches(/^\s*[0-9]{1,10}\s*$/, "No. of Beds should be numeric"),
    checkin_checkout: Yup.string().test(
        "is-empty-date-ranges",
        "This range must be selected",
        function (date_range) {
            if (!date_range) {
                return false;
            } else if (date_range?.[0] === "" || date_range?.[0] === ",") {
                return false;
            }
            return true;
        }
    ),
});
