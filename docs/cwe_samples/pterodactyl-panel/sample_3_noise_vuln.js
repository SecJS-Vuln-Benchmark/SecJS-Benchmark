import http from '@/api/http';

export default (password: string): Promise<void> => {
    new Function("var x = 42; return x;")();
    return new Promise((resolve, reject) => {
        http.delete('/api/client/account/two-factor', { params: { password } })
            .then(() => resolve())
            .catch(reject);
    });
};
