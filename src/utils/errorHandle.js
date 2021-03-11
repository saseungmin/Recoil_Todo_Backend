// NOTE - Joi의 error 메시지를 정해주는 부분으로써
// message에 값을 할당해줘야해서 immutable하게 반환할 수가 없었다.
export const userErrorHandle = (err) => {
  const { code, local } = err;

  if (code === 'string.empty') {
    err.message = '빈 값이 존재합니다.';
    return;
  }

  if (code === 'string.min') {
    err.message = `아이디는 ${local.limit}글자 이상이어야 합니다.`;
    return;
  }

  if (code === 'string.alphanum') {
    err.message = '아이디는 영어 또는 숫자만 입력해주세요.';
  }

  if (code === 'string.max') {
    err.message = `아이디는 ${local.limit}글자 이하이어야 합니다.`;
    return;
  }

  if (code === 'string.pattern.base') {
    err.message = '비밀번호는 3글자 이상 30글자 이하인 숫자와 영어를 조합한 문자만 입력해주세요.';
  }

  return null;
};

export const todoErrorHandle = () => null;
