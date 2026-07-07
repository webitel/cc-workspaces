//
// Created by igor on 9/11/20.
//
#include <memory>
#include "sip_client.h"

namespace SIP {

    static std::string parseProxy(std::string p) {
        if (p.rfind("sip:") == 0) {
            return p.substr(4);
        }

        return p;
    }

    SipClient::SipClient(const Napi::CallbackInfo &info) : ObjectWrap(info) {
        try {
            std::cout << "CONSTRUCTOR SipClient" << std::endl;
            endpoint = std::make_unique<SipEndpoint>();
            endpoint->libCreate();
            pj::EpConfig ep_cfg;
            ep_cfg.logConfig.level = 5;
            ep_cfg.uaConfig.maxCalls = 5;
            ep_cfg.uaConfig.nameserver.push_back("8.8.8.8"); // define
            // Transport
            pj::TransportConfig tcfg;
            endpoint->transportCreate(PJSIP_TRANSPORT_UDP, tcfg); //Account config ?
            endpoint->libInit(ep_cfg);
            // Start library
            endpoint->libStart();
            endpoint->libRegisterThread("ElectronSip");
        } catch (pj::Error &err) {
            std::cout << "error create library: " << err.info(true) << std::endl;
        }
    }

    SipClient::~SipClient() {
        std::cout << "~SipClient" << std::endl;
        close();
    }

    void SipClient::close() {
        try {
            if (account && endpoint) {
                endpoint->hangupAllCalls();
                account->shutdown();
            }
            if (endpoint) {
                endpoint->libStopWorkerThreads();
                endpoint.get()->instance().libDestroy();
                endpoint->libDestroy();
                account.reset();
                endpoint.reset();
            }
        } catch (pj::Error &err) {
            std::cout << "error close library: " << err.info(true) << std::endl;
        }
    }

    Napi::Value SipClient::TypeWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();
        return Napi::String::New(env, "sip");
    }

    Napi::Value SipClient::VersionWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();
        return Napi::String::New(env, USER_AGENT_NAME);
    }

    Napi::Value SipClient::CallOptionWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();
        if (!info.Length()) {
            return env.Null();
        }

        Napi::HandleScope scope(env);
        auto obj = info[0].As<Napi::Object>();

        return obj;
    }

    Napi::Value SipClient::RegisterSipWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();
        Napi::HandleScope scope(env);

        auto deferred = Napi::Promise::Deferred::New(env);

        if (info.Length() < 1) {
            deferred.Reject(
                    Napi::TypeError::New(env, "Invalid argument").Value()
            );

        } else {
            auto obj = info[0].As<Napi::Object>();
            try {
                unregister();
                UAConfig cnf = parseUaParameters(env, obj);

                for (std::size_t position = 0; position < cnf.codecs.size(); ++position) {
                    std::cout << "Set codec: " << cnf.codecs[position] << " p: " << 220 - position << std::endl;
                    try {
                        endpoint->instance().codecSetPriority(cnf.codecs[position], 220 - position);
                    } catch (...) {
                        std::cout << "Error set codec: " << cnf.codecs[position] << ", not found" << std::endl;
                    }
                }

                for (auto c : endpoint->instance().codecEnum2()) {
                    std::cout << "Codec: " << c.codecId << " priority: " << (int)c.priority << std::endl;
                }

                //return deferred.Promise();

                pj::AccountConfig acc_cfg;
                acc_cfg.idUri = "sip:" + cnf.extension + "@" + cnf.domain;

                acc_cfg.regConfig.registrarUri = (cnf.proxy.substr(0, 4).compare("sip:") != 0 ? "sip:" : "") + cnf.proxy;
                acc_cfg.regConfig.proxyUse = 1;
                acc_cfg.regConfig.timeoutSec = cnf.register_sec;

                std::cout << "URI " << acc_cfg.idUri << " Proxy: " << acc_cfg.regConfig.registrarUri << std::endl;

                if (cnf.nat == NatAuto) {
                    acc_cfg.natConfig.mediaStunUse = PJSUA_STUN_USE_DEFAULT;
                    acc_cfg.natConfig.sipStunUse = PJSUA_STUN_USE_DEFAULT;
                    acc_cfg.natConfig.iceEnabled = true;
                    acc_cfg.natConfig.sdpNatRewriteUse = PJ_FALSE;
                } else {
                    acc_cfg.natConfig.mediaStunUse = PJSUA_STUN_USE_DISABLED;
                    acc_cfg.natConfig.sipStunUse = PJSUA_STUN_USE_DISABLED;
                    acc_cfg.natConfig.iceEnabled = false;
                    acc_cfg.natConfig.sdpNatRewriteUse = PJ_TRUE;
                }

                // todo datatype 1 HA1
                acc_cfg.sipConfig.authCreds.push_back(pj::AuthCredInfo("digest", "*", cnf.auth, 0, cnf.password));
                account.reset(new SipAccount(this));

                account->ep = endpoint.get();
                account->create(acc_cfg, true);
                account->setDefault();
                account->client = this;

                device_id = cnf.auth;
                proxy = parseProxy(cnf.proxy);
//
                deferred.Resolve(env.Undefined());
            } catch (Napi::TypeError &e) {
                deferred.Reject(e.Value());
            } catch (...) {
                deferred.Reject(
                        Napi::TypeError::New(env, "Error register").Value()
                );
                throw "SIP CLIENT";
            }
        }

        return deferred.Promise();
    }

    Napi::Value SipClient::UnRegisterWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();

        auto deferred = Napi::Promise::Deferred::New(env);

        try {
            unregister();
            deferred.Resolve(Napi::Number::New(env, 0));
        } catch (...) {
            deferred.Reject(
                    Napi::TypeError::New(env, "Invalid argument").Value()
            );
        }

        return deferred.Promise();
    }

    Napi::Value SipClient::CallWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();
        Napi::HandleScope scope(env);

        std::cout << "MAKE CALL" << std::endl;

        auto deferred = Napi::Promise::Deferred::New(env);

        if (info.Length() < 1) {
            deferred.Reject(
                    Napi::TypeError::New(env, "Invalid argument").Value()
            );
        } else {
            try {
                auto obj = info[0].As<Napi::Object>();
                auto destination = parseDestination(env, obj);
                account->dial(destination);
                deferred.Resolve(env.Undefined());
            } catch (Napi::TypeError &e) {
                deferred.Reject(e.Value());
            } catch (...) {
                deferred.Reject(
                        Napi::TypeError::New(env, "Invalid argument").Value()
                );
            }
        }

        return deferred.Promise();
    }

    Napi::Value SipClient::OnWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();
        Napi::HandleScope scope(env);

        if (info.Length() < 2) {
            //TODO throw
            return env.Undefined();
        }

        std::string name = info[0].As<Napi::String>().ToString();
        if (name == "newSession") {
            this->onNewSessionCb = std::make_shared<ThreadSafeCallback>(info[1].As<Napi::Function>());
        } else if (name == "registered") {
            this->onRegisteredCb = std::make_shared<ThreadSafeCallback>(info[1].As<Napi::Function>());
        } else if (name == "unregistered") {
            this->onUnRegisterCb = std::make_shared<ThreadSafeCallback>(info[1].As<Napi::Function>());
        }

        return env.Undefined();
    }

    Napi::Value SipClient::SipSessionByCallIdWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();

        if (info.Length() < 1) {

            return Napi::TypeError::New(env, "Invalid argument").Value();
        }

        auto id = info[0].As<Napi::String>();
        if (!id.IsString() || id.IsEmpty()) {
            return Napi::TypeError::New(env, "Invalid argument").Value();
        }

        std::cout << "SipSessionByCallIdWrap >>>>>>>>>>>> " << (std::string) id.ToString() << std::endl;
        pj::Call *call = nullptr;

        if (this->account) {
            call = this->account->getCallById(id.ToString());
        }

        if (call && this->account) {
            //TODO
            auto ch = (callHash *) call->getUserData();
            if (ch) {
                std::cout << "OKOKOK>>>><<<<" << std::endl;
                return this->callObject(env, ch->sid, ch->wid);
            }
        }

        return env.Null();
    }

    Napi::Value SipClient::SipSessionBySipIdWrap(const Napi::CallbackInfo &info) {
        return this->SipSessionByCallIdWrap(info);
    }

    Napi::Function SipClient::GetClass(Napi::Env env) {
        return DefineClass(env, "SipClient", {
                SipClient::InstanceAccessor("type", &SipClient::TypeWrap, nullptr, napi_enumerable),
                SipClient::InstanceAccessor("version", &SipClient::VersionWrap, nullptr, napi_enumerable),
                SipClient::InstanceMethod("callOption", &SipClient::CallOptionWrap),
                SipClient::InstanceMethod("register", &SipClient::RegisterSipWrap),
                SipClient::InstanceMethod("unregister", &SipClient::UnRegisterWrap),
                SipClient::InstanceMethod("call", &SipClient::CallWrap),
                SipClient::InstanceMethod("destroy", &SipClient::DestroyWrap),

                SipClient::InstanceMethod("sipSessionByCallId", &SipClient::SipSessionByCallIdWrap),
                SipClient::InstanceMethod("sipSessionBySipId", &SipClient::SipSessionBySipIdWrap),
                SipClient::InstanceMethod("on", &SipClient::OnWrap),
        });
    }

    void SipClient::unregister() {
        try {
            if (account) {
                account->shutdown();
                onUnRegister();
            }
        } catch (pj::Error &err) {
            std::cout << err.info() << std::endl;
        }
    }

    Napi::Value SipClient::DestroyWrap(const Napi::CallbackInfo &info) {
        close(); // todo ?
        return Napi::Value();
    }

    void SipClient::onRegister() {
        if (onRegisteredCb) {
            auto dev = this->device_id;
            onRegisteredCb->call([dev](Napi::Env env, std::vector<napi_value> &args) {
                args = {Napi::String::New(env, dev)};
            });
        }
    }

    void SipClient::onUnRegister() {
        if (onUnRegisterCb) {
            auto dev = this->device_id;
            onUnRegisterCb->call([dev](Napi::Env env, std::vector<napi_value> &args) {
                args = {Napi::String::New(env, dev)};
            });
        }
    }

    Napi::Value SipClient::callObject(Napi::Env env, std::string id, std::string callId) {
        auto ob = Napi::Object::New(env);
        ob.Set("id", id);

        if (!callId.empty()) {
            ob.Set("callId", callId);
        }
        ob.Set("instance", Napi::External<SipClient>::New(env, this));

        ob.Set("getLocalMedia", Napi::Function::New(env, [](const Napi::CallbackInfo &info) {
            Napi::Env env = info.Env();

            return Napi::Array::New(env);
        }));
        ob.Set("getPeerMedia", Napi::Function::New(env, [](const Napi::CallbackInfo &info) {
            Napi::Env env = info.Env();

            return Napi::Array::New(env);
        }));

        ob.Set("answer", Napi::Function::New(env, [](const Napi::CallbackInfo &info) {
            Napi::Env env = info.Env();

            std::cout << "click answer" << std::endl;

            auto i = info.This().ToObject().Get("instance").As<Napi::External<SipClient>>();
            std::string id = info.This().ToObject().Get("id").As<Napi::String>().ToString();
            std::cout << "ANSWER SCOPE " << id << std::endl;
            i.Data()->answerById(id);
            return Napi::Boolean::New(env, true);
        }));

        return ob;
    }

    std::string SipClient::sipServer() {
        return proxy;
    }

    void SipClient::answerById(std::string &id) {
        if (this->account) {
            this->account->answerById(id);
        }
    }

    void SipClient::onNewSession(std::string id, std::string wid) {
        if (onNewSessionCb) {
            std::cout << "NEW SESSION" << std::endl;
            onNewSessionCb->call<Napi::Boolean>(
                    [id, wid, this](Napi::Env env, std::vector<napi_value> &args) {
                        auto ob = this->callObject(env, id, wid);
                        args = {ob};
                    },
                    [](const Napi::Value &val) {
                        return val.As<Napi::Boolean>();
                    }).wait();
        }
    }


    Napi::String VersionWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();
        Napi::String returnValue = Napi::String::New(env, USER_AGENT_NAME);

        return returnValue;
    }

    Napi::String TypeWrap(const Napi::CallbackInfo &info) {
        Napi::Env env = info.Env();
        return Napi::String::New(env, "electron");
    }

    std::string parseDestination(Napi::Env env, Napi::Object params) {
        auto dst = params.Get("destination").As<Napi::String>();
        if (!dst.IsString()) {
            throw Napi::TypeError::New(env, "Invalid argument: destination is required");
        }

        return dst.ToString();
    }

    UAConfig parseUaParameters(Napi::Env env, Napi::Object params) {
        UAConfig c;

        auto auth = params.Get("auth").As<Napi::String>();
        if (!auth.IsString()) {
            throw Napi::TypeError::New(env, "Invalid argument: auth is required");
        } else {
            c.auth = auth.ToString();
        }

        auto extension = params.Get("extension").As<Napi::String>();
        if (!extension.IsString()) {
            throw Napi::TypeError::New(env, "Invalid argument: extension is required");
        } else {
            c.extension = extension.ToString();
        }

        auto domain = params.Get("domain").As<Napi::String>();
        if (!domain.IsString()) {
            throw Napi::TypeError::New(env, "Invalid argument: domain is required");
        } else {
            c.domain = domain.ToString();
        }

        auto password = params.Get("password").As<Napi::String>();
        if (!password.IsString()) {
            throw Napi::TypeError::New(env, "Invalid argument: password is required");
        } else {
            c.password = password.ToString();
        }

        auto proxy = params.Get("proxy").As<Napi::String>();
        if (!proxy.IsString()) {
            throw Napi::TypeError::New(env, "Invalid argument: proxy is required");
        } else {
            c.proxy = proxy.ToString();
        }

        auto nat = params.Get("nat").As<Napi::String>();
        if (nat.IsString()) {
            c.nat = nat.ToString();
        }

        auto register_sec = params.Get("register_sec").As<Napi::String>();
        if (register_sec.IsString()) {
            c.register_sec = register_sec.ToNumber();
        } else {
            c.register_sec = 90;
        }

        c.codecs = std::vector<std::string>();
        auto codecs = params.Get("codecs").As<Napi::Array>();
        if (codecs.IsArray() && codecs.Length() > 0) {
            for (unsigned int i = 0; i < codecs.Length(); i++) {
                Napi::Value v = codecs.Get(i).As<Napi::String>();
                if (v.IsString()) {
                    std::cout << std::string(v.ToString()) << std::endl;
                    c.codecs.push_back(std::string(v.ToString().Utf8Value()));
                }
            }
        }
//
        if (c.codecs.size() == 0) {
            c.codecs.push_back("opus/48000/2");
            c.codecs.push_back("G722/16000/1");
            c.codecs.push_back("PCMA/8000/1");
            c.codecs.push_back("PCMU/8000/1");
        }

        std::cout << "Size codecs " << c.codecs.size() << std::endl;

        return c;
    }
}