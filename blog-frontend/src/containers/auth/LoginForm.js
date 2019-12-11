import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { form } = useSelector(({ auth }) => ({
    form: auth.login
  }));

  // input 변경 이벤트 헨들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "login",
        key: name,
        value
      })
    );
  };

  // form 등록 이벤트 헨들러
  const onSubmit = e => {
    e.preventDefault();
    // 구현예정
  };

  // 컴포넌트가 처음 랜더링될때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("login"));
  }, [dispatch]);

  return (
    <AuthForm
      type="login"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default LoginForm;
