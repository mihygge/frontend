import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Row, Col, Input } from "reactstrap";
import InputMask from "react-input-mask";
import cogoToast from "cogo-toast";
import moment from "moment";

import { askForDemoApi } from "../../../api/askForDemo/askForDemo";

import { askForDemoSchema } from "../../../forms/validations/askForDemo.validation";
import { timeZoneList } from "../../../constants/askForDemo";

import FormInput from "../../shared/formInput";
import FormSelect from "../../shared/formSelect";
import DatePicker from "../../shared/datePicker";

const FormDemo = ({ setFormSubmitted }) => {
	const initialValues = {
		name: "",
		email: "",
		title: "",
		phone: "",
		date: "",
		time_zone: "",
		time: "",
		additional: "",
	};

	const [timeIdentifier, setTimeIdentifier] = useState("AM");

	return (
		<div className="form-container-demo">
			<Formik
				initialValues={initialValues}
				validationSchema={askForDemoSchema}
				onSubmit={async (values) => {
					let unmaskedMobileNumber = "";
					if (values.phone) {
						unmaskedMobileNumber = values.phone.match(/[0-9]/gi).join("");
					}

					const formValues = {
						...values,
						name: values.name.trim(),
						title: values.title.trim(),
						phone: unmaskedMobileNumber,
						date: moment(values.date).format("DD/MM/YYYY"),
						time: moment(`${values.time} ${timeIdentifier}`, ["h:mm A"]).format("HH:mm"),
					};

					const loadingMsg = "Requesting for demo...";
					const successMsg = "Your demo has been successfully booked!";
					const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 });

					try {
						await askForDemoApi(formValues);
						hideLoading();
						cogoToast.success(successMsg, 10);
                        setFormSubmitted(true);
					} catch (error) {
                        hideLoading();
						console.log(error);
					}
				}}
			>
				{({ values, setFieldValue, errors, touched }) => (
					<Form>
						<h2 className="title-form">Personal Details</h2>
						<Row>
							<Col sm={6}>
								<FormInput
									type="text"
									name="name"
									id="name"
									labelText="Name"
									placeholder="Enter name"
									required
								/>
							</Col>
							<Col sm={6}>
								<FormInput
									type="email"
									name="email"
									id="email"
									labelText="Email"
									placeholder="Enter email address"
									required
								/>
							</Col>
							<Col sm={6}>
								<FormInput
									type="text"
									name="title"
									id="title"
									labelText="Role/Title"
									placeholder="Enter your Role"
									required
								/>
							</Col>
							<Col sm={6}>
								<div className="form-group">
									<label>Phone Number</label>
									<Input
										type="text"
										name="phone"
										id="phone"
										placeholder="Enter Mobile/Whatsapp No."
										tag={InputMask}
										mask="(+9) 999-999-9999"
										value={values.phone}
										onChange={(e) => {
											setFieldValue("phone",e.target.value);
										}}
									/>
									<ErrorMessage
										name="phone"
										component="span"
										className="error-message"
									/>
								</div>
							</Col>
						</Row>
						<h2 className="title-form title2-form">
							When Should we Contact You?
						</h2>
						<Row>
							<Col sm={6}>
								<div className="form-group timepicker-wrapper required">
									<label>
										Date <sup>*</sup>
									</label>
									<DatePicker
										placeholderText="MM/DD/YYYY"
										name="date"
										id="date"
										selected={values.date}
										minDate={new Date()}
										dateFormat="MM/DD/YYYY"
										onChange={(e) => {
											setFieldValue("date", e);
										}}
									/>
									{touched["date"] && errors["date"] && (
										<span className="error-message">
											{errors["date"]}
										</span>
									)}
								</div>
							</Col>
							<Col sm={6}>
								<FormSelect
									options={timeZoneList}
									labelText="Time Zone"
									placeholder="Choose a time zone"
									name="time_zone"
									onChange={(tz) => {
										setFieldValue("time_zone", tz.value);
									}}
									required
									classNameOut="selector-time-zone"
									error={touched?.time_zone && errors?.time_zone}
								/>
							</Col>
							<Col sm={6}>
								<div className="time-input-field form-group">
									<label>
										Time <sup>*</sup>
									</label>
									<Input
										type="text"
										name="time"
										id="time"
										placeholder="HH:MM"
										tag={InputMask}
										mask="99:99"
										value={values.time}
										onChange={(e) => {
											setFieldValue("time", e.target.value);
										}}
									/>
									{touched?.time && (
										<ErrorMessage
											name="time"
											component="span"
											className="error-message"
										/>
									)}
									<div className="time-format">
										<span
											className={timeIdentifier === "AM" ? "selected" : ""}
											onClick={() =>
												setTimeIdentifier("AM")
											}
										>
											AM
										</span>
										<span
											className={timeIdentifier === "PM" ? "selected" : ""}
											onClick={() =>
												setTimeIdentifier("PM")
											}
										>
											PM
										</span>
									</div>
								</div>
							</Col>
							<Col sm={12}>
								<div className="form-group form-group-textarea">
									<label>
										Additional Instructions{" "}
										<span>(500 Characters)</span>
									</label>
									<Field name="additional">
										{({ field, form }) => {
											return (
												<React.Fragment>
													<textarea
														{...field}
														className="form-control message-textarea"
														placeholder="Enter additional instructions"
													/>
													{form.touched[field.name] && form.errors[field.name] && (
														<span className="error-message">
															{form.errors[field.name]}
														</span>
													)}
												</React.Fragment>
											);
										}}
									</Field>
								</div>
							</Col>
						</Row>
						<button className="btn-theme btn-submit">Submit</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default FormDemo;