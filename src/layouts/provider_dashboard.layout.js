import React from 'react';
import ProvidersRouting from '../components/providercomponents/providersrouting';
import ProviderHeader  from '../containers/ProviderHeader'
const ProviderDashboard = ({ children, ...rest }) =>(
        <React.Fragment>
            <section className="providerContWrap">
            <ProvidersRouting></ProvidersRouting>

            <section className="provider__wrap">
                <ProviderHeader></ProviderHeader>
                {children}

            </section>
            </section>
        </React.Fragment>
)

export default ProviderDashboard