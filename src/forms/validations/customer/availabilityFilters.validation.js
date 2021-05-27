import * as Yup from "yup";

export const availabilityFilters = Yup.object().shape({
    available_date: Yup.string().test(
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
    no_of_beds: Yup.string()
        .required('No. of beds must be selected')
});
