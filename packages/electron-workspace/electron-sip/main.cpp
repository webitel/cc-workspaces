#ifdef WIN32
#pragma comment (lib, "Ws2_32.lib")
#endif
#include "sip_client.h"

Napi::Object init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "SipClient"), SIP::SipClient::GetClass(env));
    exports.Set(Napi::String::New(env, "version"), Napi::Function::New(env, SIP::VersionWrap));
    return exports;
}

NODE_API_MODULE(electron_sip, init)