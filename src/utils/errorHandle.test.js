import { userErrorHandle, todoErrorHandle } from './errorHandle';

describe('userErrorHandle', () => {
  context('Have error', () => {
    it('Error message should be "빈 값이 존재합니다."', () => {
      const error = {
        code: 'string.empty',
        message: '',
      };

      userErrorHandle(error);

      expect(error.message).toBe('빈 값이 존재합니다.');
    });

    it('Error message should be "아이디는 3글자 이상이어야 합니다."', () => {
      const error = {
        code: 'string.min',
        message: '',
        local: { limit: 3 },
      };

      userErrorHandle(error);

      expect(error.message).toBe('아이디는 3글자 이상이어야 합니다.');
    });

    it('Error message should be "아이디는 영어 또는 숫자만 입력해주세요."', () => {
      const error = {
        code: 'string.alphanum',
        message: '',
      };

      userErrorHandle(error);

      expect(error.message).toBe('아이디는 영어 또는 숫자만 입력해주세요.');
    });

    it('Error message should be "아이디는 20글자 이하이어야 합니다."', () => {
      const error = {
        code: 'string.max',
        message: '',
        local: { limit: 20 },
      };

      userErrorHandle(error);

      expect(error.message).toBe('아이디는 20글자 이하이어야 합니다.');
    });

    it('Error message should be "비밀번호는 3글자 이상 30글자 이하인 숫자와 영어를 조합한 문자만 입력해주세요."', () => {
      const error = {
        code: 'string.pattern.base',
        message: '',
      };

      userErrorHandle(error);

      expect(error.message).toBe('비밀번호는 3글자 이상 30글자 이하인 숫자와 영어를 조합한 문자만 입력해주세요.');
    });
  });

  context("Haven't error", () => {
    const error = {
      code: null,
    };

    it('should returns null', () => {
      const result = userErrorHandle(error);

      expect(result).toBeNull();
    });
  });
});

describe('todoErrorHandle', () => {
  it('temp test', () => {
    const result = todoErrorHandle();

    expect(result).toBeNull();
  });
});
