//
// Created by igor on 11/11/20.
//

#include <iostream>
#include "sip_client.h"
#include "sip_account.h"
#include "sip_call.h"

SIP::SipAccount::~SipAccount() {
    std::cout << "*** Account is being deleted: No of calls="
              << calls.size() << std::endl;

}

void SIP::SipAccount::removeCall(pj::Call *call) {
    if (this->calls.size() < 1) {
        return;
    }
    for (auto it = this->calls.begin();
         it != this->calls.end(); ++it) {
        if (*it == call) {
            this->calls.erase(it);
            break;
        }
    }
    std::cout << "***Remove Call is being deleted: No of calls="
              << this->calls.size() << std::endl;
}

void SIP::SipAccount::onRegState(pj::OnRegStateParam &prm) {
    Account::onRegState(prm);
    pj::AccountInfo ai = getInfo();
    if (ai.regIsActive) {
        client->onRegister();
    } else {
        client->onUnRegister();
    }
    std::cout << (ai.regIsActive ? "*** Register: code=" : "*** Unregister: code=")
              << prm.code << std::endl;
}

void SIP::SipAccount::onIncomingCall(pj::OnIncomingCallParam &iprm) {
    Account::onIncomingCall(iprm);

    std::string wid;

    auto rdata = (pjsip_rx_data *) iprm.rdata.pjRxData;
    auto message = (pjsip_msg *) rdata->msg_info.msg;

    static const std::string XWID = "X-Webitel-Uuid";

    pj_str_t event_hdr_name = pj_str((char *) XWID.c_str());
    auto event_hdr = (pjsip_generic_string_hdr *) pjsip_msg_find_hdr_by_name(message, &event_hdr_name,
                                                                             nullptr);

    pj_str_t value;
    if (event_hdr) {
        pj_strdup_with_null(rdata->tp_info.pool, &value, &event_hdr->hvalue);
        wid = std::string(value.ptr);
    }

    SipCall *call = new SipCall(*this, wid, true, iprm.callId);

    auto ch = new callHash;
    ch->wid = wid;
    ch->sid = call->sipId();
    call->setUserData(ch);

    calls.push_back(call);

    std::cout << "DO FIRE onNewSession" << std::endl;
    if (this->client) {
        std::cout << "FIRE onNewSession" << std::endl;
        this->client->onNewSession(call->sipId(), call->webitelId());
    }
}

SIP::SipAccount::SipAccount(SIP::SipClient *cli) : pj::Account() {
    client = cli;
}

void SIP::SipAccount::dial(std::string destination) {
    pj::Call *call = new SipCall(*this, "");
    pj::CallOpParam prm(true); // Use default call settings

    try {
        call->makeCall("sip:" + destination + "@" + client->sipServer(), prm);
        calls.push_back(call);
    } catch (pj::Error &err) {
        std::cout << err.info() << std::endl;
    }
}

pj::Call *SIP::SipAccount::getCallById(const std::string &id) {
    for (auto &call : calls) {
        auto ch = (callHash *) call->getUserData();
        if (ch) {
            if (ch->sid == id || ch->wid == id) {
                return call;
            }
        }
    }
    return nullptr;
}

void SIP::SipAccount::answerById(std::string id) {
    auto call = getCallById(id);
    if (call) {
        try { //todo windows crash if no media devices
            pj::CallOpParam prm;
            prm.opt.audioCount = 1;
            prm.statusCode = (pjsip_status_code) 200;
            call->answer(prm);
        } catch (pj::Error &err) {
            std::cout << err.info() << std::endl;
        }
    }
}
