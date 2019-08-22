import React from 'react'
import TableOfContents from './TableOfContents'
import ExpandedIcon from '@material-ui/icons/KeyboardArrowDown'
import CollapsedIcon from '@material-ui/icons/KeyboardArrowRight'
import { Link } from 'gatsby'
import { FormattedMessage } from 'react-intl'
import { list, options } from '@freesewing/pattern-info'
import capitalize from '@freesewing/utils/capitalize'

const TopicsToc = props => {
  const topics = ['patterns', ...props.topics]
  const topicsToc = {
    patterns: {
      title: props.app.frontend.intl.formatMessage({ id: 'app.patterns' }),
      children: {}
    },
    ...props.topicsToc
  }
  for (let pattern of list)
    topicsToc.patterns.children['/patterns/' + pattern] = { title: capitalize(pattern) }

  const isDescendant = (checkSlug, baseSlug) => {
    if (checkSlug.slice(0, baseSlug.length) === baseSlug) return true
    return false
  }

  const styles = {
    icon: {
      fontSize: '16px'
    }
  }
  const renderSidebar = () => {
    let items = []
    for (let topic of topics) {
      let active = isDescendant(props.slug, '/' + topic) ? true : false
      items.push(
        <li key={topic} className={active ? 'topic active' : 'topic'}>
          <Link className={active ? 'topic active' : 'topic'} to={'/' + topic}>
            {active ? (
              <ExpandedIcon fontSize="inherit" style={styles.icon} />
            ) : (
              <CollapsedIcon fontSize="inherit" style={styles.icon} />
            )}

            <FormattedMessage id={'app.' + topic} />
          </Link>
          {active ? renderSidebarLevel(1, topicsToc[topic].children) : null}
        </li>
      )
    }

    return <ul className="topics">{items}</ul>
  }

  const renderSidebarLevel = (level, data) => {
    // Avoid too much recursion
    if (level > 4) return null
    if (level == 2) {
      let slug = Object.keys(data)[0];
      if (slug.slice(0,15) === "/docs/patterns/") {
        for (let slug of Object.keys(data)) {
          let chunks = slug.split("/");
          //data[slug].title = capitalize(chunks[3]);
          data[slug].title = <FormattedMessage id={`patterns.${chunks[3]}.title`} />
        }
      }
    }
    if (level === 3) {
      // FIXME: This is a very hackish way to add a required measurements page per pattern
      // but it's because these pages don't exist in markdown
      let slug = Object.keys(data)[0];
      if (slug.slice(0,15) === "/docs/patterns/") {
        let chunks = slug.split("/");
        chunks.pop()
        data[chunks.join("/")+"/measurements"] = { title: <FormattedMessage id="app.requiredMeasurements" /> };
      }
      let patternChildren = false
      for (let slug of Object.keys(data)) {
        let chunks = slug.split("/");
        if (chunks.length === 5 && chunks[1] === "docs" && chunks[2] === "patterns") {
          if (chunks[4] === 'options') data[slug].title = <FormattedMessage id="app.patternOptions" />
          else if (chunks[4] === 'cutting') data[slug].title = <FormattedMessage id="app.cutting" />
          else if (chunks[4] === 'fabric') data[slug].title = <FormattedMessage id="app.fabricOptions" />
          else if (chunks[4] === 'instructions') data[slug].title = <FormattedMessage id="app.instructions" />
          else if (chunks[4] === 'needs') data[slug].title = <FormattedMessage id="app.whatYouNeed" />
          chunks.pop()
          patternChildren = chunks.join("/")+"/";
        }
      }
      if (patternChildren) {
        let newData = {}
        let order = [
          'options',
          'measurements',
          'needs',
          'fabric',
          'cutting',
          'instructions',
        ]
        for (let o of order) newData[patternChildren + o] = data[patternChildren + o]
        data = newData
      }


    }
    if (level === 4) {
      for (let slug of Object.keys(data)) {
        let chunks = slug.split("/");
        if (chunks.length === 6 && chunks[1] === "docs" && chunks[2] === "patterns" && chunks[4] === 'options') {
          for (let option of options[chunks[3]]) {
            if (option.toLowerCase() === chunks[5]) data[slug].title = <FormattedMessage id={`options.${chunks[3]}.${option}.title`} />
          }
        }
      }
    }

    let children = []
    for (let key in data) {
      let grandchildren = null
      let active = isDescendant(props.slug, key) ? true : false
      let current = props.slug === key ? true : false
      if (active && typeof data[key].children !== 'undefined') {
        grandchildren = renderSidebarLevel(level + 1, data[key].children)
      }
      let className = active ? 'active' : 'inactive'
      children.push(
        <li key={key} className={className}>
          <Link className={className} to={key}>
            {active ? (
              <ExpandedIcon fontSize="inherit" style={styles.icon} />
            ) : (
              <CollapsedIcon fontSize="inherit" style={styles.icon} />
            )}
            {data[key].title}
          </Link>
          {current ? <TableOfContents toc={props.toc} slug={key} /> : null}
          {grandchildren}
        </li>
      )
    }

    return <ul className={'topic-links level-' + level}>{children}</ul>
  }

  return renderSidebar()
}

export default TopicsToc
