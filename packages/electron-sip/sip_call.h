//
// Created by igor on 11/10/20.
//

#pragma once

#include <iostream>
#include <memory>
#include "sip_account.h"

namespace SIP {

    class SipCall : public pj::Call {
    private:
        SipAccount *myAcc;
        std::string wid;
        std::string sid;
    public:
        SipCall(pj::Account &acc, std::string wid, bool incoming = false,  int call_id = PJSUA_INVALID_ID);
        ~SipCall();
        std::string webitelId();
        std::string sipId();
        pj::CallInfo inviteInfo;

        virtual void onCallState(pj::OnCallStateParam &prm);

        virtual  void onCallMediaState(pj::OnCallMediaStateParam &prm);
    };
}
