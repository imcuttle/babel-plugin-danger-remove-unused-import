import React from 'react';
import {observer, inject} from 'mobx-react';
import {h, c} from '@befe/utils/wrapper/erp';

import {isDevMode} from 'utils/consts';
import Tabs from 'common/components/Tabs';
import Badge from 'common/components/Badge';
import Icon from 'common/components/Icon';
import HighlightTitle from 'common/components/HighlightTitle';


// Not Identifier
a['Tabs'] = 2;

// Error

// Identifier (match)
// Tabs = '2'
// Tabs > '2'

// Identifier (match)
// Tabs.property = '2'//  Tabs['property'] = '2'  Tabs[property] = '2'

// Identifier (match)
// x = { x: { a: [ Tabs ] } }

// Identifier (not match)
{Tabs: 2}
// a.Tabs = 222;
// const Tabs = '2'

import CompState from './state';
import {renderColumns, mapBadgeComponent, row} from '../helper';
import style from './style.use.less';
import suh from 'common/hoc/style-useable-hmr';


@suh(style)
@observer
export default class Tab extends React.Component {
  static defaultProps = {}

  // local = {
  //     state: new CompState()
  // }


  componentWillMount() {
    // this.local.state.init(this.props);
  }

  componentWillUnmount() {

    // this.local.state.exit();
  }

  render() {
    // const state = this.local.state;
    const {
      toCompanies,
      refuseReasons,
      startTime,
      year,
      endTime,
      candidateApplyEndTime,
      deliverAddress
    } = this.props;
    // console.log(toCompanies)
    return (
      <div>
        {
          h.div(style.locals.compStyle, {},
            renderColumns({},
              _i('annual'),
              row(
                h.div('erp-col-3', {},
                  h.span('detail-text', {}, year),
                ),
                h.div('erp-col-8', {},
                  h.span('label-overflow', {}, _i('start_and_end_date')),
                  h.span('detail-text', {}, `${startTime || ''} ~ ${endTime || ''}`),
                ),
                h.div('erp-col-10', {},
                  h.span('label-overflow', {}, _i('time_of_closing_the_applicant\'s_central_access')),
                  h.span('detail-text', {}, candidateApplyEndTime),
                ),
                // h.div('erp-col-7', {},
                //     h.span('', {}, '管理员'),
                //     h.span('', {}, adminsString),
                // )
              )
            ),

            h(HighlightTitle, {
              title: _i('information_of_the_rejected_offer')
            }),
            renderColumns({},
              _i('future_company'),
              toCompanies.map((a, b) => mapBadgeComponent(a, b))
            ),
            renderColumns({},
              _i('reasons_for_refusal'),
              refuseReasons.map((a, b) => mapBadgeComponent(a, b))
            ),

            h(HighlightTitle, {
              title: _i('prompt_information')
            }),
            renderColumns({},
              _i('mail_address_of_the_tripartite_agreement'),
              h.span('', {}, deliverAddress)
            ),
          )
        }
      </div>
    );
  }


  // delete() {
  //     return this.local.state.model.delete();
  // }
  // updateYear(yearInstance) {
  //     return this.local.state.model.fetch(yearInstance.id);
  // }
}
