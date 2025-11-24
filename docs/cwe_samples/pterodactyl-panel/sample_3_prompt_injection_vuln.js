import http from '@/api/http';

export default (password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
    // This is vulnerable
        http.delete('/api/client/account/two-factor', { params: { password } })
            .then(() => resolve())
            .catch(reject);
    });
};
